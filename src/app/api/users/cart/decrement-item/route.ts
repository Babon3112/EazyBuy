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

  const { productId, color, size } = await request.json();
  try {
    await dbConnect();
    const cart = await CartModel.findOne({ userId: session.user._id });

    if (cart) {
      const product = cart.products.find(
        (product) =>
          product.productId.toString() === productId &&
          product.color === color &&
          product.size === size
      );

      if (product) {
        product.quantity = Math.max(product.quantity - 1, 1);
      }

      await cart.save();
      return Response.json(
        { success: true, cart, message: "Quantity updated successfully" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "Error updating quantity" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
