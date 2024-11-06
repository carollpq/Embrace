
import mongoose from "mongoose";
import UserModel, { User, NewUser } from "../models/User";

// Connect to MongoDB with connection handling
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }
};

connectToDatabase();

// Function to retrieve a user from the database by email
export const getUserFromDb = async (email: string): Promise<User | null> => {
  return await UserModel.findOne({ email }).exec();
};

// Function to add a new user to the database
export const addUserToDb = async (userData: NewUser): Promise<void> => {
  await UserModel.create(userData);
};
