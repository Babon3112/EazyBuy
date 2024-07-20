import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  UploadResponse,
} from "@/utils/cloudinary.util";

interface ProductFormData {
  brand: string;
  title?: string;
  description?: string;
  image?: File | string;
  categories?: string[];
  color?: string[];
  price?: number;
  inStock?: boolean;
  size?: string[];
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.isAdmin) {
    try {
      await dbConnect();

      const formData = await request.formData();
      const data: ProductFormData = {
        brand: formData.get("brand") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        image: formData.get("image") as File | undefined,
        categories: (formData.getAll("categories") as string[]).filter(Boolean),
        color: (formData.getAll("color") as string[]).filter(Boolean),
        price: parseFloat(formData.get("price") as string),
        inStock: formData.get("inStock") === "true",
        size: (formData.getAll("size") as string[]).filter(Boolean),
      };
      const {
        brand,
        title,
        description,
        image,
        categories,
        color,
        price,
        inStock,
        size,
      } = data;

      const productId = formData.get("productId") as string;
      const product = await ProductModel.findById(productId);

      if (!product) {
        return Response.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      const toUpdate: Partial<ProductFormData> = {};
      if (brand && brand !== product.brand) toUpdate.brand = brand;
      if (title && title !== product.title) toUpdate.title = title;
      if (description && description !== product.description)
        toUpdate.description = description;
      if (
        categories &&
        categories.length &&
        categories.join() !== product.categories.join()
      )
        toUpdate.categories = categories;
      if (color && color.length && color.join() !== product.color.join())
        toUpdate.color = color;
      if (price && price !== product?.price) toUpdate.price = price;
      if (inStock !== undefined && inStock !== product.inStock)
        toUpdate.inStock = inStock;
      if (size && size.length && size.join() !== product.size?.join())
        toUpdate.size = size;

      let imageUrl = "";
      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());
        if (product.image !== "") {
          deleteFromCloudinary(product.image as string);
        }
        const uploadResponse: UploadResponse = await uploadOnCloudinary(
          buffer,
          "EazyBuy/Products"
        );
        if (uploadResponse.url) {
          imageUrl = uploadResponse.url;
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

        toUpdate.image = imageUrl;
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        { $set: toUpdate },
        { new: true }
      );
      if (!updatedProduct) {
        return Response.json(
          { success: false, message: "Failed to update product" },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Product updated successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating product:", error);
      return Response.json(
        { success: false, message: "Internal server error" },
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
