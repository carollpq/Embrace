import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const currentPath = req.nextUrl.pathname;

  try {
    if (token && typeof token === "string") {
      // Verify token using the jose library (no Node.js crypto dependency)
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      // Redirect authenticated users to `/home-page` if they are not already there
      if (currentPath === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/home-page";
        return NextResponse.redirect(url);
      }

      // Allow the request to proceed for authenticated users
      return NextResponse.next();
    } else {
      console.error("Token is not a valid string:", token);
    }
  } catch (error) {
    console.error("JWT verification failed or token not found:", error);
  }

  // Allow requests to proceed if no redirection is needed
  return NextResponse.next();
}