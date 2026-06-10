import "server-only";

import { cookies } from "next/headers";
import { generateToken } from "@/utils/auth/jwt";
import { TOKEN_MAX_AGE_SECONDS } from "@/utils/auth/constants";

export type AuthUser = { id: string; name: string; email: string };

export async function setSessionCookie(user: AuthUser): Promise<void> {
    const token = await generateToken(user);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: TOKEN_MAX_AGE_SECONDS,
    });
}
