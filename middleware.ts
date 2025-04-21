import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const currentPath = req.nextUrl.pathname;

  try {
    if (token && typeof token === "string") {
      await jwtVerify(token, secret);

      if (currentPath === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/home-page";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }
  } catch (err) {
    console.error("JWT verification failed:", err);
  }

  return NextResponse.next();
}
