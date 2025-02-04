// src/routes/memos/new/+page.server.ts
import { db } from '$lib/server/db';
import { memo_tags, memos, tags } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    try {
        // Load all available tags for the user
        const userTags = await db.query.tags.findMany({
            where: eq(tags.userId, 1) // TODO: Get from session
        });

        return {
            tags: userTags
        };
    } catch (error) {
        console.error('Error loading tags:', error);
        return {
            tags: []
        };
    }
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const content = data.get('content')?.toString();
        const title = data.get('title')?.toString();
        const visibility = data.get('visibility')?.toString() || 'private';
        const pinned = data.get('pinned') === 'true';
        const selectedTags = data.getAll('tags[]').map(Number);

        if (!content?.trim()) {
            return fail(400, { 
                error: 'Content is required',
                data: { title, content, visibility, pinned, selectedTags }
            });
        }

        try {
            const [memo] = await db.insert(memos).values({
                userId: 1, // TODO: Get from session
                title: title || null,
                content,
                visibility,
                pinned: pinned ? 1 : 0,
                createdAt: Math.floor(Date.now() / 1000),
                updatedAt: Math.floor(Date.now() / 1000)
            }).returning();

            if (selectedTags.length > 0) {
                await db.insert(memo_tags).values(
                    selectedTags.map(tagId => ({
                        memoId: memo.id,
                        tagId,
                        createdAt: Math.floor(Date.now() / 1000)
                    }))
                );
            }

            return { success: true, memo };
        } catch (error) {
            console.error('Error creating memo:', error);
            return fail(500, { 
                error: 'Failed to create memo',
                data: { title, content, visibility, pinned, selectedTags }
            });
        }
    }
};