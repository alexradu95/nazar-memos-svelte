// src/lib/db/migrate.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize the database
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

// Run migrations
async function main() {
  console.log('Running migrations...');
  
  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../../../drizzle/migrations')
  });
  
  console.log('Migrations completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
});