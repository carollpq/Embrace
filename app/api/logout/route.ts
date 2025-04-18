import { NextResponse } from "next/server";


export default async function POST() {
  try {
    // Clear the token from cookies
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.set("token", "", { maxAge: 0 }); // Expire the token

    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
