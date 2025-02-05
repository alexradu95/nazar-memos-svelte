// src/routes/auth/logout/+server.ts
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteSessionCookie } from "$lib/server/auth/cookies";
import { invalidateSession } from "$lib/server/auth/session";

export const POST: RequestHandler = async (event) => {
    // If there's a session, invalidate it
    if (event.locals.session) {
        await invalidateSession(event.locals.session.id);
    }
    
    // Clear the session cookie
    deleteSessionCookie(event);
    
    // Redirect to home page
    throw redirect(303, "/");
};