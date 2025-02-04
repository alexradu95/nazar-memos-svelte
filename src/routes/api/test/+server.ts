// src/routes/api/test/+server.ts
import { json } from '@sveltejs/kit';
import { sqlite } from '$lib/server/db';

export async function GET() {
    try {
        // List all tables
        const tables = sqlite.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table'
        `).all();
        
        // Get schema for memos table
        const memosSchema = sqlite.prepare(`
            SELECT sql FROM sqlite_master 
            WHERE type='table' AND name='memos'
        `).get();

        return json({ 
            tables, 
            memosSchema,
            message: 'Database connection successful'
        });
    } catch (err) {
        const error = err as Error;
        console.error('Database error:', error);
        return json(
            { 
                error: 'Database error', 
                details: error?.message || 'Unknown error' 
            }, 
            { status: 500 }
        );
    }
}