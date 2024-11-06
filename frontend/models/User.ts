// models/User.ts
import mongoose, { Document } from "mongoose";

// Define the interface for the User document
export interface User extends Document {
  name: string;
  email: string;
  password: string; //What is this exactly?
}

// Define the type for new user data
export type NewUser = {
  name: string;
  email: string;
  password: string;
};

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the User model
const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);

// Export the model and the interface
export default UserModel;
