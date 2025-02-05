// src/lib/server/auth/session.ts
import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq, lte } from 'drizzle-orm';
import type { User, Session } from '../db/schema';

// Generate a random session token using Web Crypto API
// The session token should be a random string. We recommend generating at least 20 random bytes from a secure source 
// (DO NOT USE Math.random()) and encoding it with base32. You can use any encoding schemes, but base32 is case insensitive 
// unlike base64 and only uses alphanumeric letters while being more compact than hex encoding.
export function generateSessionToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

// Create a new session for a user
export async function createSession(userId: number): Promise<Session> {
    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session: Omit<Session, "id"> & { id: string } = {
        id: generateSessionToken(),
        userId,
        expiresAt
    };

    const [newSession] = await db.insert(sessions)
        .values(session)
        .returning();

    return newSession;
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

// Validate a session token
export async function validateSession(sessionId: string): Promise<SessionValidationResult> {
    const result = await db
        .select({
            user: users,
            session: sessions
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId))
        .limit(1);

    if (result.length < 1) {
        return { session: null, user: null };
    }

    const { user, session } = result[0];
    const now = new Date();

    // Check if session has expired
    if (now >= session.expiresAt) {
        await invalidateSession(session.id);
        return { session: null, user: null };
    }

    // Extend session if it's close to expiring (within 15 days)
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

    if (session.expiresAt <= fifteenDaysFromNow) {
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 30);

        await db
            .update(sessions)
            .set({
                expiresAt: newExpiresAt
            })
            .where(eq(sessions.id, session.id));

        session.expiresAt = newExpiresAt;
    }

    return { session, user };
}

// Invalidate (delete) a session
export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// Clean up expired sessions
export async function cleanupSessions(): Promise<void> {
    const now = new Date();
    await db.delete(sessions)
        .where(lte(sessions.expiresAt, now));
}