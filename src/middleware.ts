import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/",
    "/signup",
    "/verify/:path*",
    "/signin",
    "/your-account/:path*",
    "/change-password/:path*",
    "/delete-account/:path*",
    "/wishlist",
    "/send-forgot-password-email",
    "/forgot-password/:path*",
    "/admin/:path*",
    "/your-orders",
    "/order",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET_KEY,
  });

  const { pathname } = request.nextUrl;

  if (token) {
    if (token.isAdmin === false && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.startsWith("/signup") ||
      pathname.startsWith("/verify") ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/send-forgot-password-email") ||
      pathname.startsWith("/forgot-password")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (
      pathname.startsWith("/your-account") ||
      pathname.startsWith("/change-password") ||
      pathname.startsWith("/delete-account") ||
      pathname.startsWith("/your-orders") ||
      pathname.startsWith("/wishlist") ||
      pathname.startsWith("/order") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
