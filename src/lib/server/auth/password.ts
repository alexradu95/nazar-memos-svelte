// src/lib/server/auth/password.ts
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [salt, hash] = storedPassword.split(':');
    const derivedKey = await scryptAsync(suppliedPassword, salt, 64) as Buffer;
    return hash === derivedKey.toString('hex');
}

export function validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}