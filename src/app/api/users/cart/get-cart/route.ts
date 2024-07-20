import { getServerSession } from "next-auth";
import CartModel from "@/models/cart.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const cart = await CartModel.findOne({ userId: session.user._id }).exec();

    if (!cart) {
      return Response.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      cart,
      message: "Cart successfully found.",
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: "error" + error.message },
      { status: 500 }
    );
  }
}
