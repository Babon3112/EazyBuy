import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import UserModel from "@/models/user.model";
import { deleteFromCloudinary } from "@/utils/cloudinary.util";
import bcryptjs from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import wishlistModel from "@/models/wishlist.model";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { password } = await request.json();
  if (!password) {
    return Response.json(
      { success: false, message: "Password is required." },
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

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    if (user.avatar !== "") {
      deleteFromCloudinary(user.avatar as string);
    }

    const [cartDelete, wishlistdelete, userDelete] = await Promise.all([
      CartModel.findByIdAndDelete({ userId: user._id }),
      wishlistModel.findOneAndDelete({ userId: user._id }),
      UserModel.findByIdAndDelete(user._id),
    ]);

    if (!cartDelete && !wishlistdelete && !userDelete) {
      return Response.json(
        { success: false, message: "Failed to delete user." },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { success: false, message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
