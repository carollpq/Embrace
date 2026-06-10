"use server";

import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { connect } from '@/utils/config/dbConfig';
import User from '@/utils/models/User';
import { setSessionCookie, type AuthUser } from '@/utils/auth/session';
import { MIN_PASSWORD_LENGTH } from "@/utils/auth/constants";

export type SignUpState = {
    name: string;
    email: string;
    password: string;
    success?: boolean;
    user?: AuthUser;
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        form?: string[];
    };
};

const signUpSchema = z.object({
    name: z.string().trim().min(1, "Please enter your name"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
});

export async function createUser(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    const raw = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const parsed = signUpSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            name: String(raw.name ?? ''),
            email: String(raw.email ?? ''),
            password: '',
            errors: z.flattenError(parsed.error).fieldErrors,
        };
    }

    const { name, email, password } = parsed.data;

    try {
        await connect();

        const existing = await User.findOne({ email });
        if (existing) {
            return {
                name,
                email,
                password: '',
                errors: { email: ["An account with this email already exists"] },
            };
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const saved = await new User({ name, email, password: hashedPassword }).save();

        const authUser: AuthUser = { id: String(saved._id), name: saved.name, email: saved.email };
        await setSessionCookie(authUser);

        return {
            name,
            email,
            password: '',
            success: true,
            user: authUser,
        };
    } catch (error) {
        console.error("createUser failed:", error);
        return {
            name,
            email,
            password: '',
            errors: { form: ["Sign-up failed. Please try again."] },
        };
    }
}