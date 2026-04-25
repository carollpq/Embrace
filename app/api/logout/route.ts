import { NextResponse } from "next/server";


export async function POST() {
  try {
    // Clear the token from cookies
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.set("token", "", { maxAge: 0 }); // Expire the token

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
