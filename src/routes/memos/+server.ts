import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { memos } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allMemos = await db.select().from(memos);
    return json({ memos: allMemos });
  } catch (error) {
    console.error('Database error:', error);
    return json(
      { error: 'Failed to fetch memos' },
      { status: 500 }
    );
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    const newMemo = await db.insert(memos).values({
      userId: 1, // We'll update this with real user ID once auth is implemented
      title: data.title,
      content: data.content,
      visibility: data.visibility || 'private',
      pinned: data.pinned ? 1 : 0
    }).returning();

    return json({ memo: newMemo[0] });
  } catch (error) {
    console.error('Database error:', error);
    return json(
      { error: 'Failed to create memo' },
      { status: 500 }
    );
  }
}