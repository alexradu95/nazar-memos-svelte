// src/lib/server/seed.ts
import { db } from './db';
import { users } from '$lib/db/schema';

export async function seedDatabase() {
    console.log('Seeding database...');
    
    try {
        // Check if we already have users
        const existingUsers = await db.select().from(users);
        
        if (existingUsers.length === 0) {
            // Insert initial user
            await db.insert(users).values([
                {
                    username: 'admin',
                    email: 'admin@example.com',
                    passwordHash: 'initial-hash',
                    settingsJson: JSON.stringify({ theme: 'light' })
                }
            ]);
            console.log('Database seeded');
        } else {
            console.log('Database already has data, skipping seed');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}