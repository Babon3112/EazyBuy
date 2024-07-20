import ProductModel from "@/models/product.model";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    // const objectId = new mongoose.Types.ObjectId(productId);

    const product = await ProductModel.findById(productId);

    if (!product) {
      return Response.json({ success: false, message: "Product not found" });
    }

    return Response.json(
      { success: true, product, message: "Product found" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
