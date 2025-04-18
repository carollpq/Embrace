import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const currentPath = req.nextUrl.pathname;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    if (token && typeof token === "string") {
      await jwtVerify(token, new TextEncoder().encode(secret));

      // Redirect authenticated users from "/" to "/home-page"
      if (currentPath === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/home-page";
        return NextResponse.redirect(url);
      }

      return NextResponse.next(); // Authenticated, proceed
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
  }

  // Redirect unauthenticated users to sign-in if accessing protected page
  if (currentPath !== "/" && currentPath !== "/sign-in" && currentPath !== "/sign-up") {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Public routes
}

export const config = {
  matcher: ["/", "/home-page", "/chatInterface"],
};
