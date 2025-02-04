// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'path';
import * as schema from '../../../lib/db/schema';

// Default to a local SQLite database file if DATABASE_URL is not set
const DATABASE_URL = process.env.DATABASE_URL || join(process.cwd(), 'sqlite.db');

// Create/connect to SQLite database
const sqlite = new Database(DATABASE_URL);

// Create db connection with schema
export const db = drizzle(sqlite, { schema });

// Function to close database connection
export function closeDatabase() {
    sqlite.close();
}