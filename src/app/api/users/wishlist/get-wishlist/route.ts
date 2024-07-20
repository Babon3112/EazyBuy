import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import wishlistModel from "@/models/wishlist.model";
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
    const wishlist = await wishlistModel.findOne({
      userId: session.user._id,
    });
    if (wishlist) {
      return Response.json({
        success: true,
        wishlist,
        message: "wishlist successfully found.",
      });
    } else {
      return Response.json(
        { success: false, message: "wishlist not found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return Response.json(
      { success: false, message: "error" + error.message },
      { status: 500 }
    );
  }
}
