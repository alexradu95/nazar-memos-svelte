// src/lib/server/auth/cookies.ts
import type { RequestEvent } from "@sveltejs/kit";

export function setSessionCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt
    });
}

export function getSessionToken(event: RequestEvent): string | undefined {
    return event.cookies.get("session");
}

export function deleteSessionCookie(event: RequestEvent): void {
    event.cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0
    });
}