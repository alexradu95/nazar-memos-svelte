// src/routes/auth/login/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { AuthService } from "$lib/server/auth/service";
import { setSessionCookie } from "$lib/server/auth/cookies";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, "/");
    }
};

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        if (!email || !password) {
            return fail(400, { 
                error: "Email and password are required" 
            });
        }

        const result = await AuthService.login(email, password, {
            userAgent: event.request.headers.get("user-agent") || undefined
        });
        
        if (!result.success) {
            return fail(400, { 
                error: result.error 
            });
        }

        setSessionCookie(event, result.session.id, result.session.expiresAt);
        throw redirect(302, "/");
    }
} satisfies Actions;