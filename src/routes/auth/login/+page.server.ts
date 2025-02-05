// src/routes/auth/login/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "$lib/server/auth/password";
import { createSession } from "$lib/server/auth/session";
import { setSessionCookie } from "$lib/server/auth/cookies";

export const load: PageServerLoad = async ({ locals }) => {
    // Redirect to home if already logged in
    if (locals.user) {
        throw redirect(302, "/");
    }
};

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const email = data.get("email");
        const password = data.get("password");

        if (!email || !password || 
            typeof email !== "string" || 
            typeof password !== "string") {
            return fail(400, {
                error: "Missing email or password"
            });
        }

        // Find user by email
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (!user) {
            return fail(400, {
                error: "Invalid email or password"
            });
        }

        // Verify password
        const validPassword = await verifyPassword(user.passwordHash, password);
        if (!validPassword) {
            return fail(400, {
                error: "Invalid email or password"
            });
        }

        // Create session
        const session = await createSession(user.id);
        setSessionCookie(event, session.id, session.expiresAt);

        throw redirect(302, "/");
    }
};