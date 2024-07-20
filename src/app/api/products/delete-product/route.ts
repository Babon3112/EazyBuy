import dbConnect from "@/lib/dbConnect";
import { deleteFromCloudinary } from "@/utils/cloudinary.util";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ProductModel from "@/models/product.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.isAdmin) {
    try {
      await dbConnect();

      const { productId } = await request.json();
      const objectId = new mongoose.Types.ObjectId(productId);
      const product = await ProductModel.findById(objectId);
      if (!product) {
        return Response.json(
          { success: false, message: "Product not found." },
          { status: 404 }
        );
      }

      deleteFromCloudinary(product.image as string);

      const productDelete = await ProductModel.findByIdAndDelete(product._id);

      if (!productDelete) {
        return Response.json(
          { success: false, message: "Failed to delete product." },
          { status: 500 }
        );
      }

      return Response.json(
        { success: true, message: "Product deleted successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      console.error(error);
      return Response.json(
        {
          success: false,
          message: error.message || "Failed to delete product.",
        },
        { status: 500 }
      );
    }
  } else {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
