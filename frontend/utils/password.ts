// utils/password.ts
import bcrypt from "bcrypt";

// Function to hash a password
export const saltAndHashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of salt rounds, can be adjusted for security
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to verify a password
export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};
