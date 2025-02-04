import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/db/schema';

export async function GET() {
    try {
        const allUsers = await db.select().from(users);
        return json({ success: true, users: allUsers });
    } catch (error) {
        console.error('Database error:', error);
        return json({ success: false, error: 'Database error' }, { status: 500 });
    }
}