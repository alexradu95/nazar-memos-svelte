// src/routes/auth/register/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, validatePasswordStrength } from "$lib/server/auth/password";
import { createSession } from "$lib/server/auth/session";
import { setSessionCookie } from "$lib/server/auth/cookies";

// This type will be used by SvelteKit for form actions
type FormError = {
    error: string;
    errors?: string[];
}

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, "/");
    }
};

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");

        if (!username || !email || !password || !confirmPassword ||
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof confirmPassword !== "string") {
            return fail<FormError>(400, {
                error: "All fields are required",
                errors: []
            });
        }

        // Validate username format
        if (username.length < 3 || username.length > 31 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
            return fail<FormError>(400, {
                error: "Username must be between 3 and 31 characters and can only contain letters, numbers, underscores, and hyphens",
                errors: []
            });
        }

        // Validate email format
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            return fail<FormError>(400, {
                error: "Invalid email address",
                errors: []
            });
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return fail<FormError>(400, {
                error: "Password is not strong enough",
                errors: passwordValidation.errors
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return fail<FormError>(400, {
                error: "Passwords do not match",
                errors: []
            });
        }

        try {
            // Check if username is taken
            const existingUsername = await db
                .select()
                .from(users)
                .where(eq(users.username, username))
                .limit(1);

            if (existingUsername.length > 0) {
                return fail<FormError>(400, {
                    error: "Username is already taken",
                    errors: []
                });
            }

            // Check if email is taken
            const existingEmail = await db
                .select()
                .from(users)
                .where(eq(users.email, email.toLowerCase()))
                .limit(1);

            if (existingEmail.length > 0) {
                return fail<FormError>(400, {
                    error: "Email is already registered",
                    errors: []
                });
            }

            // Hash password and create user
            const hashedPassword = await hashPassword(password);
            
            const [user] = await db.insert(users)
                .values({
                    username,
                    email: email.toLowerCase(),
                    passwordHash: hashedPassword,
                    settingsJson: JSON.stringify({ theme: "light", notifications: true }),
                })
                .returning();

            // Create session
            const session = await createSession(user.id);
            setSessionCookie(event, session.id, session.expiresAt);

            throw redirect(302, "/");
        } catch (error) {
            console.error("Error during registration:", error);
            return fail<FormError>(500, {
                error: "An error occurred during registration",
                errors: []
            });
        }
    }
} satisfies Actions;