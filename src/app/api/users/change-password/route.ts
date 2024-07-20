import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { currentPassword, newPassword, confirmPassword } =
    await request.json();
  if (!currentPassword || !newPassword || !confirmPassword) {
    return Response.json(
      { success: false, message: "Passwords are required." },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return Response.json(
      {
        success: false,
        message: "Password and confirm password not matched.",
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const user = await UserModel.findOne({ _id: session.user._id });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found with provided details." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "Current password not matched.",
        },
        { status: 401 }
      );
    }
    const isPasswordsame = await bcryptjs.compare(newPassword, user.password);
    if (isPasswordsame) {
      return Response.json(
        {
          success: false,
          message: "Current password and new password can't be the same.",
        },
        { status: 401 }
      );
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
