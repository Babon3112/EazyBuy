import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        emailorMobileNo: {
          label: "email or mobile number",
          type: "text",
          placeholder: "Type your registered email or phone number",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Type your password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { mobileno: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with provided details.");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before continuing.");
          }
          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password.");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id?.toString();
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.username = user.username;
        token.mobileno = user.mobileno;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.isAdmin = user.isAdmin;
      }

      if (trigger === "update") {
        token.fullname = session.fullname;
        token.avatar = session.avatar;
        token.username = session.username;
        token.mobileno = session.mobileno;
        token.email = session.email;
      }
      return token;
    },
    async session({ session, token, trigger, newSession }) {
      if (token) {
        session.user._id = token._id;
        session.user.fullname = token.fullname;
        session.user.avatar = token.avatar;
        session.user.username = token.username;
        session.user.mobileno = token.mobileno;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
};
