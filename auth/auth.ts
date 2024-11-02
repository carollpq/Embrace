import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

import { ZodError } from "zod";
import { signInSchema } from "../lib/zod";
// Import your password hashing and verification utilities
import { verifyPassword } from "@/utils/password";
import { getUserFromDb } from "@/utils/db";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AppleProvider({ //Need to implement this properly
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Get the user from the database
          const user = await getUserFromDb(email);

          // If the user does not exist, return null
          if (!user || !(await verifyPassword(password, user.passwordHash))) {
            throw new Error("Invalid credentials.");
          }

          // Return JSON object with the user data
          return { id: user.id, email: user.email }; 
        } catch (error) {
          if (error instanceof ZodError) {
            return null; // Return null if the input is invalid
          }
          //console.error(error); // Log other errors for debugging
          return null; // Return null for other errors
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
