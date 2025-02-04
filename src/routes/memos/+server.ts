// src/routes/api/memos/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { memos } from '$lib/db/schema';

export async function GET() {
    try {
        const allMemos = await db.select().from(memos);
        return json({ success: true, memos: allMemos });
    } catch (error) {
        console.error('Database error:', error);
        return json(
            { success: false, error: 'Failed to fetch memos' }, 
            { status: 500 }
        );
    }
}