import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
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
  try {
    await dbConnect();
    const { orderId } = await req.json();

    if (!orderId) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const cancelOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: "Cancelled" },
      { new: true }
    );

    if (!cancelOrder) {
      return Response.json(
        { success: false, message: "Failed to create order" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Order cancelled successfully" },
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
