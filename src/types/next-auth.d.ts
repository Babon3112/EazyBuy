import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      fulllname?: string;
      avatar?: string;
      username?: string;
      mobileno?: number;
      email?: string;
      isVerified?: boolean;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    fullname?: string;
    avatar?: string;
    username?: string;
    mobileno?: number;
    email?: string;
    password?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    fullname?: string;
    avatar?: string;
    username?: string;
    mobileno?: number;
    email?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
  }
}
