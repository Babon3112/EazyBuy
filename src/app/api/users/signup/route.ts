"use server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import CartModel from "@/models/cart.model";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  UploadResponse,
} from "@/utils/cloudinary.util";
import bcryptjs from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import wishlistModel from "@/models/wishlist.model";

interface UserFormData {
  fullname: string;
  username: string;
  mobileno: string;
  email: string;
  password: string;
  avatar?: File;
  verifyUrl: string;
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const data: UserFormData = {
      fullname: formData.get("fullname") as string,
      username: formData.get("username") as string,
      mobileno: formData.get("mobileno") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      avatar: formData.get("avatar") as File | undefined,
      verifyUrl: formData.get("verifyUrl") as string,
    };

    const { fullname, username, mobileno, email, password, avatar, verifyUrl } =
      data;

    if (!fullname || !username || !mobileno || !email || !password) {
      throw new Error("All fields are required");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    let avatarUrl = "";
    if (avatar && avatar instanceof File) {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      const uploadResponse: UploadResponse = await uploadOnCloudinary(
        buffer,
        "EazyBuy/Avatar"
      );
      if (uploadResponse.url) {
        avatarUrl = uploadResponse.url;
      } else {
        console.error("Avatar upload failed:", uploadResponse.error);
        return Response.json(
          { success: false, message: "Avatar upload failed" },
          { status: 500 }
        );
      }
    }
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const existingUserByEmail = await UserModel.findOne({ email });
    const existingUserByMobileno = await UserModel.findOne({ mobileno });

    if (existingUserByMobileno || existingUserByEmail) {
      if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
          return Response.json(
            {
              success: false,
              message: "User already exists with this email",
            },
            { status: 400 }
          );
        } else {
          if (existingUserByEmail.avatar !== "") {
            deleteFromCloudinary(existingUserByEmail.avatar as string);
          }

          existingUserByEmail.fullname = fullname;
          existingUserByEmail.avatar = avatarUrl;
          existingUserByEmail.username = username;
          existingUserByEmail.mobileno = mobileno;
          existingUserByEmail.email = email;
          existingUserByEmail.password = hashedPassword;

          existingUserByEmail.save();
        }
      }

      if (existingUserByMobileno) {
        if (existingUserByMobileno.isVerified) {
          return Response.json(
            {
              success: false,
              message: "User already exists with this mobile number.",
            },
            { status: 400 }
          );
        } else {
          if (existingUserByMobileno.avatar !== "") {
            deleteFromCloudinary(existingUserByMobileno.avatar as string);
          }

          existingUserByMobileno.fullname = fullname;
          existingUserByMobileno.avatar = avatarUrl;
          existingUserByMobileno.username = username;
          existingUserByMobileno.mobileno = mobileno;
          existingUserByMobileno.email = email;
          existingUserByMobileno.password = hashedPassword;

          existingUserByMobileno.save();
        }
      }
    } else {
      const newUser = new UserModel({
        avatar: avatarUrl,
        fullname,
        username: username.toLowerCase(),
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();

      const newUserCart = await CartModel.create({ userId: newUser._id });
      if (!newUserCart) {
        throw new Error("Failed to create new user cart");
      }
      newUser.cartId = newUserCart._id as string;
      await newUser.save();
      const newUserWishlist = await wishlistModel.create({
        userId: newUser._id,
      });
      if (!newUserWishlist) {
        throw new Error("Failed to create new user wishlist");
      }
      newUser.wishlistId = newUserWishlist._id as string;
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
      verifyUrl
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User signed up successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new error(error.message || "Failed to create user");
  }
}
