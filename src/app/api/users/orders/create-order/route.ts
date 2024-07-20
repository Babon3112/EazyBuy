import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import CartModel from "@/models/cart.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = session.user._id;
  try {
    await dbConnect();

    const { details, products, amount, address, paymentMethod } =
      await req.json();

    if (!details || !products || !amount || !address || !paymentMethod) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const newOrder = await OrderModel.create({
      userId,
      details,
      products,
      amount,
      address,
      status: "Placed",
      paymentMethod,
    });

    if (!newOrder) {
      return Response.json(
        { success: false, message: "Failed to create order" },
        { status: 500 }
      );
    }

    await CartModel.updateOne({ userId }, { $set: { products: [] } });

    return Response.json(
      { success: true, message: "Order places successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: "Internal Server Error",
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
