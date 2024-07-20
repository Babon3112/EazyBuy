import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product.model";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const keyword = url.searchParams.get("cat");

    if (!keyword) {
      return Response.json(
        {
          success: false,
          message: "Keyword is required for searching products",
        },
        { status: 400 }
      );
    }

    const keywordStr = keyword as string;
    const products = await ProductModel.find({
      $or: [
        { brand: { $regex: keywordStr, $options: "i" } },
        { title: { $regex: keywordStr, $options: "i" } },
        { description: { $regex: keywordStr, $options: "i" } },
        { categories: { $regex: keywordStr, $options: "i" } },
        { color: { $regex: keywordStr, $options: "i" } },
        { size: { $regex: keywordStr, $options: "i" } },
      ],
    })
      .lean()
      .sort({ createdAt: -1 });

    if (!products) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, products, message: "Products found" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error) {
      return Response.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    return Response.json(
      { succes: false, message: "Internal Server error" },
      { status: 500 }
    );
  }
}
