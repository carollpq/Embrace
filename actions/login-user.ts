"use server";

import { z } from "zod";
import bcryptjs from "bcryptjs";
import { connect } from "@/utils/config/dbConfig";
import User from "@/utils/models/User";
import { setSessionCookie, type AuthUser } from "@/utils/auth/session";
import { MIN_PASSWORD_LENGTH } from "@/utils/auth/constants";

export type SignInState = {
    email: string;
    password: string;
    success?: boolean;
    user?: AuthUser;
    errors?: {
        email?: string[];
        password?: string[];
        form?: string[];
    };
};

const signInSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
});

export async function loginUser(_prevState: SignInState, formData: FormData): Promise<SignInState> {
    const raw = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const parsed = signInSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            email: String(raw.email ?? ''),
            password: '',
            errors: z.flattenError(parsed.error).fieldErrors,
        };
    }

    const { email, password } = parsed.data;

    try {
        await connect();

        const user = await User.findOne({ email });
        const validPassword = user && (await bcryptjs.compare(password, user.password));

        if (!validPassword) {
            return {
                email,
                password: '',
                errors: { form: ["Invalid email or password"] },
            }
        };

        const authUser: AuthUser = { id: String(user._id), name: user.name, email: user.email };
        await setSessionCookie(authUser);

        return {
            email: user.email,
            password: '',
            success: true,
            user: authUser,
        };
    } catch (error) {
        console.error("loginUser failed:", error);
        return {
            email,
            password: '',
            errors: { form: ["Sign-in failed. Please try again."] },
        };
    }
}