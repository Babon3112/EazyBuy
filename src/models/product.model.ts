import mongoose, { Schema, Document, Model } from "mongoose";

export interface Product extends Document {
  image: string;
  brand: string;
  title: string;
  description: string;
  categories: string[];
  color: string[];
  price: number;
  inStock?: boolean;
  size?: string[];
}

const productSchema: Schema<Product> = new Schema(
  {
    image: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categories: { type: [String], required: true, lowercase: true, trim: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    color: { type: [String], lowercase: true, trim: true },
    size: { type: [String], lowercase: true, trim: true },
  },
  { timestamps: true }
);

const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);

export default ProductModel;
