// utils/db.ts
import mongoose from "mongoose";
import UserModel, { User } from "../models/User"; // Import the model and the interface

// Connect to MongoDB
// Add error handling
mongoose.connect(process.env.MONGODB_URI!);

// Function to retrieve a user from the database by email
export const getUserFromDb = async (email: string): Promise<User | null> => {
  const user = await UserModel.findOne({ email }).exec();
  return user; // Returns a User document or null if not found
};

// Function to add a new user to the database
// Add data validation
export const addUserToDb = async (userData: Omit<User, "_id">): Promise<void> => {
  await UserModel.create(userData);
};
