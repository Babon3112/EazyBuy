import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import CartModel from "@/models/cart.model";
import wishlistModel from "@/models/wishlist.model";

export async function POST(request: Request) {
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    await dbConnect();

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry!) > new Date();

    if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    const [cart, wishlist] = await Promise.all([
      CartModel.create({ userId: user._id }),
      wishlistModel.create({ userId: user._id }),
    ]);

    if (!cart || !wishlist) {
      return Response.json(
        { success: false, message: "Failed to initialize user data" },
        { status: 500 }
      );
    }

    user.cartId = cart._id as string;
    user.wishlistId = wishlist._id as string;

    await user.save();

    return Response.json(
      { success: true, message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user." },
      { status: 500 }
    );
  }
}
