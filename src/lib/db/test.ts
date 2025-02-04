// src/lib/db/test.ts
import { db } from './index';
import { seed } from './seed';
import { users, memos } from './schema';
import { eq } from 'drizzle-orm';

async function testDatabase() {
  try {
    // Seed the database
    console.log('Seeding database...');
    await seed();
    console.log('Database seeded successfully!');

    // Test queries
    console.log('\nTesting queries:');
    
    // Get all users
    const allUsers = await db.select().from(users);
    console.log('\nAll users:', allUsers);

    // Get memos for first user
    if (allUsers.length > 0) {
      const userMemos = await db.select()
        .from(memos)
        .where(eq(memos.userId, allUsers[0].id));
      console.log('\nMemos for user', allUsers[0].username + ':', userMemos);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testDatabase();