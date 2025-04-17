import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import jwtVerify from 'jose'

// JWT secret key (ensure this is properly set in your environment variables)
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper function to extract a specific cookie from the request headers
const getCookie = (req: NextResponse, cookieName: string) => {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;

  const cookieArray = cookies.split("; ").map((cookie) => cookie.split("="));
  const cookie = cookieArray.find(([name]) => name === cookieName);

  return cookie ? decodeURIComponent(cookie[1]) : null;
};

export async function GET(req: NextResponse) {
  // Extract token from cookies
  const token = getCookie(req, "token");

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, secretKey);

    // If the token is valid, return the user data from the payload
    return NextResponse.json({ user: payload });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
