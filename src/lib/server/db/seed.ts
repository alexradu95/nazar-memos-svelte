import { db } from './index';
import { users, memos } from './schema';

export async function seedDatabase() {
  try {
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Insert initial users
      const [user1] = await db.insert(users).values([
        {
          username: 'demo_user',
          email: 'demo@example.com',
          passwordHash: 'hashed_password_here',
          settingsJson: JSON.stringify({ theme: 'light', notifications: true })
        }
      ]).returning();

      // Insert sample memos
      await db.insert(memos).values([
        {
          userId: user1.id,
          title: 'Welcome Note',
          content: 'Welcome to your memo app! This is a sample memo to get you started.',
          visibility: 'private',
          pinned: 1
        },
        {
          userId: user1.id,
          title: 'Shopping List',
          content: '- Groceries\n- Household items\n- Office supplies',
          visibility: 'private',
          pinned: 0
        },
        {
          userId: user1.id,
          title: 'Project Ideas',
          content: '1. Build a personal website\n2. Learn a new programming language\n3. Start a blog',
          visibility: 'private',
          pinned: 0
        }
      ]);

      console.log('Database seeded successfully');
    } else {
      console.log('Database already has data, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}