import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const currentPath = req.nextUrl.pathname;

  // Define public routes clearly
  const publicPaths = ["/", "/sign-in", "/sign-up"];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET not defined");
      return NextResponse.next(); // Avoid 500
    }

    if (token) {
      // Attempt to verify token
      await jwtVerify(token, new TextEncoder().encode(secret));

      // If at root, redirect to /home-page
      if (currentPath === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/home-page";
        return NextResponse.redirect(url);
      }

      return NextResponse.next(); // ✅ Authenticated, proceed
    }
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    // Let it fall through to redirect if needed
  }

  // If user is unauthenticated and trying to access a protected route
  if (!publicPaths.includes(currentPath)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // ✅ Public route, proceed
}
export const config = {
  matcher: ["/((?!_next|favicon.ico|api|sign-in|sign-up).*)"],
};