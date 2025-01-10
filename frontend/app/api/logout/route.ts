import { NextResponse } from "next/server";


export async function POST() {
  try {
    // Clear the token from cookies
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.set("token", "", { maxAge: 0 }); // Expire the token

    // Redirect user to the home page
    return NextResponse.redirect(new URL("/", response.url)); // Redirect to "/"
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
