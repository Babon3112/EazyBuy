import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.isAdmin) {
    try {
      await dbConnect();
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");
      console.log(userId);

      const user = await UserModel.findById(userId);

      if (!user) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      return Response.json(
        { success: true, user, message: "User found" },
        { status: 200 }
      );
    } catch (error: any) {
      return Response.json(
        { success: false, message: error.message || "Internal server error." },
        { status: 500 }
      );
    }
  } else {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
