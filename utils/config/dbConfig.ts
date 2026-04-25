import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err);
      process.exit();
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}