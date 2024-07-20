import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const orders = await OrderModel.find({ userId: session.user._id }).sort({
      createdAt: -1,
    });

    return Response.json(
      { success: true, orders, message: "Order places successfully" },
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
