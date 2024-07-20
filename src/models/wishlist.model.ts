import mongoose, { Schema, Document, Model } from "mongoose";

export interface WishlistProduct {
  productId: mongoose.Schema.Types.ObjectId;
  brand: string;
  title: string;
  image: string;
  color?: string;
  size?: string;
  price: number;
}

export interface Wishlist extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  products: WishlistProduct[];
}

const wishlistSchema: Schema<Wishlist> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        title: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const wishlistModel: Model<Wishlist> =
  mongoose.models.Wishlist ||
  mongoose.model<Wishlist>("Wishlist", wishlistSchema);

export default wishlistModel;
