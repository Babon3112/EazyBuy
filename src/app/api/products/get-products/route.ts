import ProductModel from "@/models/product.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const queryNew = url.searchParams.get("new");

    let products;

    if (queryNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(8);
    }

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
