import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";  // Import SignJWT from jose
import User from "@/utils/models/User";
import { connect } from "@/utils/config/dbConfig";

export async function POST(req) {
  await connect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // Optional: Add regex to validate email format if needed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    

    // Find user
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Generate JWT using jose
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET); // Ensure JWT secret is encoded as a Uint8Array

    // Generate JWT using jose
    const token = await new SignJWT({ id: user._id, email: user.email, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })  // Set the JWT algorithm (HS256)
      .setIssuedAt()  // Set issued time
      .setExpirationTime("1h")  // Set expiration time
      .sign(secretKey);  // Sign with the JWT secret

    // Set cookie
    const response = NextResponse.json({ success: true, message: "Login successful" });
    response.cookies.set("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // Only set secure in production
      path: "/", // Make cookie accessible across the entire domain
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
