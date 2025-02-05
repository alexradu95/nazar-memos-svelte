// src/lib/server/auth/index.ts
export * from './session';
export * from './password';
export * from './cookies';

// This makes imports cleaner:
import { createSession, validateSession, hashPassword } from '$lib/server/auth';