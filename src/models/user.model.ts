import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
  fullname: string;
  avatar?: string;
  username: string;
  mobileno: string;
  email: string;
  password: string;
  cartId?: string;
  wishlistId?: string;
  isVerified: boolean;
  isAdmin: boolean;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  forgotPasswordCode?: string;
  forgotPasswordCodeExpiry?: Date;
}

const userSchema: Schema<User> = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    mobileno: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: { type: String, required: true },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
    wishlistId: { type: Schema.Types.ObjectId, ref: "Wishlist" },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    forgotPasswordCode: { type: String },
    forgotPasswordCodeExpiry: { type: Date },
  },
  { timestamps: true }
);

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
