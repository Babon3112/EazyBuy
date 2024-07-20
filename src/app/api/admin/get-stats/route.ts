import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session && session.user.isAdmin) {
    try {
      const date = new Date();
      const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

      const data = await UserModel.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      if (!data.length) {
        return Response.json(
          { succes: false, message: "Error while fetching data" },
          { status: 500 }
        );
      }

      return Response.json({
        succes: true,
        data,
        message: "User registration statistics fetched successfully",
      });
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
