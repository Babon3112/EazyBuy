import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { productId } = await request.json();

  if (!productId) {
    return Response.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const updatedCart = await CartModel.findOneAndUpdate(
      { userId: session.user._id },
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return Response.json(
        { success: false, message: "Failed to remove product from cart." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Product removed from cart successfully",
        cart: updatedCart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
