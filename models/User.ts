// models/User.ts
import mongoose, { Document } from "mongoose";

// Define the interface for the User document
export interface User extends Document {
  email: string;
  passwordHash: string; //What is this exactly?
}

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

// Create the User model
const UserModel = mongoose.model<User>("User", userSchema);

// Export the model and the interface
export default UserModel;
