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
      const query = url.searchParams.get("new");

      const users = await (query
        ? UserModel.find().sort({ _id: -1 }).limit(5)
        : UserModel.find());

      if (!users.length) {
        return Response.json(
          {
            success: false,
            message: "Error while fetching users.",
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          users,
          mesage: "Users fetched successfully",
        },
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
