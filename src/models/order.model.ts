import mongoose, { Schema, Document, Model } from "mongoose";

export interface OrderProduct {
  productId: mongoose.Schema.Types.ObjectId;
  brand: string;
  image: string;
  title: string;
  quantity: number;
  color?: string;
  size?: string;
  price: number;
}

export interface Order extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  details: Record<string, any>;
  products: OrderProduct[];
  amount: number;
  address: Record<string, any>;
  status?: string;
  paymentMethod: string;
}

const orderSchema: Schema<Order> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details: { type: Object, required: true },
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
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const OrderModel: Model<Order> =
  mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);

export default OrderModel;
