import mongoose, { Schema, Document, Model } from "mongoose";

export interface CartProduct {
  productId: mongoose.Schema.Types.ObjectId;
  brand: string;
  title: string;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
  price: number;
}

export interface Cart extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  products: CartProduct[];
  quantity?: number;
  totalPrice?: number;
}

const cartSchema: Schema<Cart> = new Schema(
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
        quantity: { type: Number, default: 1 },
        color: { type: String, required: true },
        size: { type: String },
        price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.virtual("quantity").get(function (this: Cart) {
  return this.products.length;
});

cartSchema.virtual("total").get(function (this: Cart) {
  return this.products.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0
  );
});

const CartModel: Model<Cart> =
  mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);

export default CartModel;
