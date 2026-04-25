import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/utils/models/User";
import { connect } from "@/utils/config/dbConfig";
import { generateToken, setAuthCookie } from "@/utils/auth/jwt";
import { isValidEmail } from "@/utils/validation";

export async function POST(req: Request) {
  await connect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await generateToken({ id: user._id, email: user.email, name: user.name });
    const response = NextResponse.json({ success: true, message: "Login successful" });
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Error during signin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
