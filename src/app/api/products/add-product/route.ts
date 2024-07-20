import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product.model";
import { uploadOnCloudinary, UploadResponse } from "@/utils/cloudinary.util";
import fs from "fs/promises";
import { getServerSession } from "next-auth";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/options";

interface ProductFormData {
  productImage: File;
  brand: string;
  title: string;
  description: string;
  categories: string[];
  price: number;
  inStock: boolean;
  color?: string[];
  size?: string[];
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.isAdmin) {
    try {
      await dbConnect();
      const formData = await request.formData();
      const data: ProductFormData = {
        brand: formData.get("brand") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        productImage: formData.get("productImage") as File,
        categories: formData.getAll("categories") as string[],
        price: parseFloat(formData.get("price") as string),
        inStock: formData.has("inStock")
          ? formData.get("inStock") === "true"
          : true,
        color: formData.getAll("color") as string[],
        size: formData.getAll("size") as string[],
      };

      const {
        productImage,
        brand,
        title,
        description,
        categories,
        price,
        inStock,
        color,
        size,
      } = data;

      if (
        !brand ||
        !title ||
        !description ||
        !categories ||
        !price ||
        !productImage
      ) {
        return Response.json(
          {
            success: false,
            message: "All required fields must be filled.",
          },
          { status: 400 }
        );
      }

      let productImageURL = "";
      if (productImage && productImage instanceof File) {
        const buffer = Buffer.from(await productImage.arrayBuffer());
        const uploadResponse: UploadResponse = await uploadOnCloudinary(
          buffer,
          "EazyBuy/Products"
        );
        if (uploadResponse.url) {
          productImageURL = uploadResponse.url;
        } else {
          console.error("Product Image upload failed:", uploadResponse.error);
          return Response.json(
            {
              success: false,
              message: "Prouct image upload failed:" + uploadResponse.error,
            },
            { status: 500 }
          );
        }
      }

      const newProduct = new ProductModel({
        image: productImageURL,
        brand,
        title,
        description,
        categories,
        color,
        price,
        inStock,
        size,
      });

      await newProduct.save();

      return Response.json(
        { success: true, message: "Product added successfully." },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error adding product:", error);
      return Response.json(
        {
          success: false,
          message: error.message || "Failed to add product",
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
