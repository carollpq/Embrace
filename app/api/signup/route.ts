import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/utils/config/dbConfig";
import User from "@/utils/models/User";
import bcryptjs from "bcryptjs";
import { generateToken, setAuthCookie } from "@/utils/auth/jwt";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const savedUser = await new User({
      name, email, password: hashedPassword,
    }).save();

    const token = await generateToken({ id: savedUser._id, email: savedUser.email, name: savedUser.name });
    const response = NextResponse.json({
      message: "User created successfully",
      success: true,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
