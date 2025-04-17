import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "please write your name"]},
  email: { type: String, required: [true, "please provide a valid email"], unique: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.models.user || mongoose.model("user", userSchema);

// Export the model and the interface
export default User;
