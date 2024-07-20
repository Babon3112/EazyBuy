import UserMoodel from "@/models/user.model";
import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordEmail";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  const { email, forgotPasswordUrl } = await request.json();
  if (!email) {
    return Response.json(
      {
        success: false,
        message: "Email is required to send password reset email.",
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const user = await UserMoodel.findOne({ email });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user exists with this email.",
        },
        { status: 404 }
      );
    }

    let forgotPasswordCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.forgotPasswordCode = forgotPasswordCode;
    user.forgotPasswordCodeExpiry = new Date(Date.now() + 1800000);
    await user.save();

    const emailResponse = await sendForgotPasswordEmail(
      email,
      forgotPasswordCode,
      forgotPasswordUrl
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
      {
        success: true,
        message: "forgot password code mail is successfully sent",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error sending forgot password mail",
      },
      { status: 500 }
    );
  }
}
