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

  const { productId, color, size } = await req.json();

  try {
    await dbConnect();
    let wishlist = await WishlistModel.findOne({ userId: session.user._id });

    if (!wishlist) {
      return Response.json(
        { success: false, message: "Wishlist not found." },
        { status: 404 }
      );
    } else {
      const productIndex = wishlist.products.findIndex(
        (p: any) =>
          p.productId.toString() === productId &&
          p.color === color &&
          p.size === size
      );

      if (productIndex > -1) {
        return Response.json(
          {
            success: true,
            message: "Product exists in wishlist",
            exists: true,
          },
          { status: 200 }
        );
      } else {
        return Response.json(
          { success: true, message: "Product not in wishlist", exists: false },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
