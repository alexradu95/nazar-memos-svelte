// src/lib/server/auth/types.ts
import type { User, Session } from '../db/schema';

export interface AuthUser extends User {}

export interface LoginSuccess {
    success: true;
    user: AuthUser;
    session: Session;
}

export interface LoginFailure {
    success: false;
    error: string;
}

export type LoginResult = LoginSuccess | LoginFailure;

export interface RegisterSuccess {
    success: true;
    user: AuthUser;
    session: Session;
}

export interface RegisterFailure {
    success: false;
    error: string;
    errors?: string[];
}

export type RegisterResult = RegisterSuccess | RegisterFailure;