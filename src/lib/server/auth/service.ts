// src/lib/server/auth/service.ts
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from './password';
import { createSession } from './session';
import type { LoginResult, RegisterResult } from './types';

interface AuthContext {
    userAgent?: string;
}

export class AuthService {
    static async login(email: string, password: string, context?: AuthContext): Promise<LoginResult> {
        // Find user
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (!user) {
            return { 
                success: false, 
                error: "Invalid email or password" 
            };
        }

        // Verify password
        const validPassword = await verifyPassword(user.passwordHash, password);
        if (!validPassword) {
            return { 
                success: false, 
                error: "Invalid email or password" 
            };
        }

        // Create session
        const session = await createSession(user.id, context?.userAgent);

        return { 
            success: true, 
            user, 
            session 
        };
    }

    static async register(userData: {
        username: string;
        email: string;
        password: string;
    }, context?: AuthContext): Promise<RegisterResult> {
        try {
            // Check if email exists
            const existingEmail = await db
                .select()
                .from(users)
                .where(eq(users.email, userData.email.toLowerCase()))
                .limit(1);

            if (existingEmail.length > 0) {
                return {
                    success: false,
                    error: "Email already registered"
                };
            }

            // Check if username exists
            const existingUsername = await db
                .select()
                .from(users)
                .where(eq(users.username, userData.username))
                .limit(1);

            if (existingUsername.length > 0) {
                return {
                    success: false,
                    error: "Username already taken"
                };
            }

            const hashedPassword = await hashPassword(userData.password);
            
            const [user] = await db.insert(users)
                .values({
                    username: userData.username,
                    email: userData.email.toLowerCase(),
                    passwordHash: hashedPassword,
                    settingsJson: JSON.stringify({ theme: "light" })
                })
                .returning();

            const session = await createSession(user.id, context?.userAgent);
            
            return { 
                success: true, 
                user, 
                session 
            };
        } catch (error) {
            return { 
                success: false, 
                error: "Registration failed",
                errors: [(error as Error).message]
            };
        }
    }
}