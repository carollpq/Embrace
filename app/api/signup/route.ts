import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/utils/config/dbConfig";
import User from "@/utils/models/User";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";  // Import SignJWT from jose

export default async function POST(req: NextRequest) {
  await connect();

  try{
    const {name, email, password} = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const ifUserExists = await User.findOne({email});
    if (ifUserExists) {
      return NextResponse.json(
        { error: "User already exists "},
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const savedUser = await new User({
        name, email, password: hashedPassword,
    }).save();

    // Generate JWT token using jose
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET); // Make sure the secret is encoded properly

    // Generate JWT token using jose
    const token = await new SignJWT({ id: savedUser._id, email: savedUser.email, name: savedUser.name })
      .setProtectedHeader({ alg: 'HS256' }) // Set the header (protected or unprotected)
      .setIssuedAt()  // Set issued time
      .setExpirationTime("3h")
      .sign(secretKey);
      

    // Set the token in cookies
    const response = NextResponse.json({
      message: "User created successfully",
      success: true,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });

    // Set cookie with token
    response.cookies.set("token", token, {
      httpOnly: true, // Token will not be accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Set secure flag for production
      path: "/", // Make cookie accessible across the entire domain
      sameSite: "lax",
      maxAge: 60 * 60 * 3, // 3 hours
    });

    return response;
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({error: error}, { status: 500 });
  }
}
