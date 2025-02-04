// src/lib/server/db.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { resolve } from 'path';
import * as schema from '$lib/server/db/schema';

// This path is relative to where the application runs
const DB_PATH = resolve('./sqlite.db');

// Create/connect the database
const sqlite = new Database(DB_PATH);

// Create db connection with schema
export const db = drizzle(sqlite, { schema });

// Setup function to run migrations and initialize db
export async function initializeDatabase() {
    console.log('Initializing database...');
    
    // Run migrations
    console.log('Running migrations...');
    try {
        await migrate(db, {
            migrationsFolder: resolve('./drizzle/migrations')
        });
        console.log('Migrations complete');
    } catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    }
}

// Function to close database connection
export function closeDatabase() {
    sqlite.close();
}