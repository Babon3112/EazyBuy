import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import { getServerSession } from "next-auth";
import ProductModel from "@/models/product.model";
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

  const { productId, quantity, color, size, price } = await req.json();

  if (!productId || !price || !quantity || !color || !size) {
    return Response.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    let cart = await CartModel.findOne({ userId });
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return Response.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    if (!cart) {
      cart = new CartModel({
        userId,
        products: [
          {
            productId,
            image: product.image,
            brand: product.brand,
            title: product.title,
            quantity,
            color,
            size,
            price,
          },
        ],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p: any) =>
          p.productId.toString() === productId &&
          p.color === color &&
          p.size === size
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          image: product.image,
          brand: product.brand,
          title: product.title,
          quantity,
          color,
          size,
          price,
        });
      }
    }

    await cart.save();
    return Response.json(
      { success: true, message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
