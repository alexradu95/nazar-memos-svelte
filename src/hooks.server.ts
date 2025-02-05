// src/hooks.server.ts
import { validateSession } from "$lib/server/auth/session";
import { getSessionToken, setSessionCookie, deleteSessionCookie } from "$lib/server/auth/cookies";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const PUBLIC_PATHS = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/reset-password"
];

export const handle: Handle = async ({ event, resolve }) => {
    // CSRF protection for non-GET requests
    if (event.request.method !== "GET") {
        const origin = event.request.headers.get("Origin");
        const host = event.request.headers.get("Host");
        
        if (origin && !origin.endsWith(host ?? "")) {
            return new Response(null, { status: 403 });
        }
    }

    // Check if the path is public
    const isPublicPath = PUBLIC_PATHS.includes(event.url.pathname);

    // Get session token from cookie
    const token = getSessionToken(event);
    if (token === undefined) {
        event.locals.user = null;
        event.locals.session = null;
        
        // If accessing protected route without session, redirect to login
        if (!isPublicPath) {
            throw redirect(303, "/auth/login");
        }
        
        return await resolve(event);
    }

    // Validate session
    const { session, user } = await validateSession(token);
    
    if (session && user) {
        // Set session in locals
        event.locals.session = session;
        event.locals.user = user;
        
        // Refresh session cookie
        setSessionCookie(event, token, session.expiresAt);
    } else {
        // Clear invalid session
        event.locals.session = null;
        event.locals.user = null;
        deleteSessionCookie(event);
        
        // If accessing protected route with invalid session, redirect to login
        if (!isPublicPath) {
            throw redirect(303, "/auth/login");
        }
    }

    return await resolve(event);
};