import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
  fullname: string;
  avatar?: string;
  username: string;
  mobileno: string;
  email: string;
  password: string;
  cartId: string;
  wishlistId: string;
  isVerified: boolean;
  isAdmin: boolean;
  verifyCode: string | undefined;
  verifyCodeExpiry: Date | undefined;
  forgotPasswordCode: string | undefined;
  forgotPasswordCodeExpiry: Date | undefined;
}

const userSchema: Schema<User> = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    avatar: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    mobileno: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "please enter a valid email"],
    },
    password: { type: String, required: [true, "Password is required"] },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpiry: {
      type: Date,
    },
    forgotPasswordCode: {
      type: String,
    },
    forgotPasswordCodeExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
