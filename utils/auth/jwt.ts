import { SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(payload: { id: string; email: string; name: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3h")
    .sign(secretKey);
}