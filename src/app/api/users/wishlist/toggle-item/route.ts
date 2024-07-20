import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/models/wishlist.model";
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

  const { productId, color, size } = await req.json();
  console.log(productId, color, size);

  if (!productId || !color || !size) {
    return Response.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    let wishlist = await WishlistModel.findOne({ userId });
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return Response.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    if (!wishlist) {
      wishlist = new WishlistModel({
        userId,
        products: [
          {
            productId,
            brand: product.brand,
            title: product.title,
            image: product.image,
            price: product.price,
            color,
            size,
          },
        ],
      });
      await wishlist.save();
    } else {
      const productIndex = wishlist.products.findIndex(
        (p: any) =>
          p.productId.toString() === productId &&
          p.color === color &&
          p.size === size
      );
      if (productIndex > -1) {
        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
        return Response.json(
          {
            success: true,
            message: "Product removed from wishlist successfully",
          },
          { status: 200 }
        );
      } else {
        wishlist.products.push({
          productId,
          brand: product.brand,
          title: product.title,
          image: product.image,
          color,
          size,
          price: product.price,
        });
        await wishlist.save();
      }
    }

    return Response.json(
      { success: true, message: "Product added to wishlist" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding product to wishlist:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
