import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/utils/config/dbConfig";
import User from "@/utils/models/User";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
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
        { error: "User alrrady exists "},
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const savedUser = await new User({
        name, email, password: hashedPassword,
    }).save();

    return NextResponse.json({
      message: "User created successfully",
      success:true,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    })
  } catch (error: any) {
    console.error("Error during signup:", error);
    return NextResponse.json({error: error.message}, { status: 500 });
  }
}
