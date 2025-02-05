// src/lib/server/auth/session.ts
import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq, lte } from 'drizzle-orm';
import type { User, Session } from '../db/schema';

// Generate a random session token using Web Crypto API
export function generateSessionToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

// Create a new session for a user
export async function createSession(userId: number, userAgent?: string): Promise<Session> {
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (30 * 24 * 60 * 60); // 30 days from now in seconds

    const session: Omit<Session, "id"> & { id: string } = {
        id: generateSessionToken(),
        userId,
        expiresAt,
        createdAt: now,
        lastUsed: now,
        userAgent: userAgent || null
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
    const now = Math.floor(Date.now() / 1000);

    // Check if session has expired
    if (now >= session.expiresAt) {
        await invalidateSession(session.id);
        return { session: null, user: null };
    }

    // Extend session if it's close to expiring (within 15 days)
    const fifteenDaysFromNow = now + (15 * 24 * 60 * 60);

    if (session.expiresAt <= fifteenDaysFromNow) {
        const newExpiresAt = now + (30 * 24 * 60 * 60);
        const newLastUsed = now;

        await db
            .update(sessions)
            .set({
                expiresAt: newExpiresAt,
                lastUsed: newLastUsed
            })
            .where(eq(sessions.id, session.id));

        session.expiresAt = newExpiresAt;
        session.lastUsed = newLastUsed;
    }

    return { session, user };
}

// Invalidate (delete) a session
export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// Clean up expired sessions
export async function cleanupSessions(): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await db.delete(sessions)
        .where(lte(sessions.expiresAt, now));
}