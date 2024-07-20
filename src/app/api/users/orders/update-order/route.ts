import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const { orderId, details, address } = await req.json();

    if (!orderId || !details || !address) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const orderID = new mongoose.Types.ObjectId(orderId);
    console.log(orderID);

    const updatedOrder = await OrderModel.findByIdAndUpdate(orderID, {
      details,
      address,
    });

    if (!updatedOrder) {
      return Response.json(
        { success: false, message: "Failed to create order" },
        { status: 500 }
      );
    }

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
