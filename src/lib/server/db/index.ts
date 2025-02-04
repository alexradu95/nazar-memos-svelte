import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { join } from 'path';

// Default to a local SQLite database file
const DATABASE_URL = join(process.cwd(), 'sqlite.db');

// Create/connect to SQLite database
const sqlite = new Database(DATABASE_URL);

// Create db connection with schema
export const db = drizzle(sqlite, { schema });

// Export function to close database connection
export function closeDatabase() {
  sqlite.close();
}