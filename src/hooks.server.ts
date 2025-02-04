import { seedDatabase } from '$lib/server/db/seed';
import type { Handle } from '@sveltejs/kit';

// Seed database on startup
seedDatabase().catch(console.error);

export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event);
};