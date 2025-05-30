"use server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  UploadResponse,
} from "@/utils/cloudinary.util";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

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
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
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

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const existingUserByEmail = await UserModel.findOne({ email });
    const existingUserByMobile = await UserModel.findOne({ mobileno });

    if (existingUserByEmail && existingUserByEmail.isVerified) {
      return Response.json(
        { success: false, message: "Email is already registered." },
        { status: 400 }
      );
    }

    if (existingUserByMobile && existingUserByMobile.isVerified) {
      return Response.json(
        { success: false, message: "Mobile number is already registered." },
        { status: 400 }
      );
    }

    const userToUpdate = existingUserByEmail || existingUserByMobile;

    if (userToUpdate) {
      if (userToUpdate.avatar) await deleteFromCloudinary(userToUpdate.avatar);
      Object.assign(userToUpdate, {
        fullname,
        username: username.toLowerCase(),
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: avatarUrl,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
      });
      await userToUpdate.save();
    } else {
      const newUser = new UserModel({
        fullname,
        username: username.toLowerCase(),
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: avatarUrl,
        verifyCode,
        verifyCodeExpiry,
      });
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
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Signup successful. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);
    return Response.json(
      { success: false, message: error.message || "Signup failed." },
      { status: 500 }
    );
  }
}
