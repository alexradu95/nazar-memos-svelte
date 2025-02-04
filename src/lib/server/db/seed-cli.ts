// src/lib/server/db/seed-cli.ts
import { seedDatabase } from './seed';

// This file will be run via npm script
seedDatabase()
    .then(() => {
        console.log('Database seeded successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });