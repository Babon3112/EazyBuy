import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  UploadResponse,
} from "@/utils/cloudinary.util";
import { authOptions } from "../../auth/[...nextauth]/options";

interface UserFormData {
  fullname: string;
  username: string;
  mobileno: string;
  email: string;
  password: string;
  avatar?: File | string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const data: UserFormData = {
    fullname: formData.get("fullname") as string,
    username: formData.get("username") as string,
    mobileno: formData.get("mobileno") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    avatar: formData.get("avatar") as File | undefined,
  };
  const { fullname, username, mobileno, email, avatar } = data;

  try {
    await dbConnect();

    const userId = session.user._id;
    const user = await UserModel.findById(userId);

    const toUpdate: Partial<UserFormData> = {};
    if (fullname && fullname !== user?.fullname) toUpdate.fullname = fullname;

    if (username && username !== user?.username) {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return Response.json(
          { success: false, message: "Username already exists" },
          { status: 400 }
        );
      }
      toUpdate.username = username;
    }

    if (mobileno && mobileno !== user?.mobileno) {
      const existingUser = await UserModel.findOne({ mobileno });
      if (existingUser) {
        return Response.json(
          { success: false, message: "Mobile number already exists" },
          { status: 400 }
        );
      }
      toUpdate.mobileno = mobileno;
    }

    if (email && email !== user?.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return Response.json(
          { success: false, message: "Email already exists" },
          { status: 400 }
        );
      }
      toUpdate.email = email;
    }

    let avatarUrl = "";
    if (avatar && avatar instanceof File) {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      if (user?.avatar !== "") {
        deleteFromCloudinary(user?.avatar as string);
      }
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

      toUpdate.avatar = avatarUrl;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: toUpdate },
      { new: true, select: "-password" }
    );
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update profile" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, updatedUser, message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
