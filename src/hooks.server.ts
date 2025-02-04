import { db, closeDatabase } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

// Close database when server shuts down
process.on('SIGTERM', closeDatabase);
process.on('SIGINT', closeDatabase);

export const handle: Handle = async ({ event, resolve }) => {
    // Database is automatically initialized when imported
    return resolve(event);
};