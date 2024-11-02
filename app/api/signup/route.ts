import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { addUserToDb, getUserFromDb } from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Check if the user already exists
    const existingUser = await getUserFromDb(email);
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add user to the database
    await addUserToDb({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
