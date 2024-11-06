// lib/zod.ts
import { z } from "zod";

// Define schema for sign-in form
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
