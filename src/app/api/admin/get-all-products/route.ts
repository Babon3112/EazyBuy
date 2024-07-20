import ProductModel from "@/models/product.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const products = await ProductModel.find().sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return Response.json(
        { succes: false, message: "Products not found." },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, products, message: "Products found" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { succss: false, message: error.message },
      { status: 500 }
    );
  }
}
