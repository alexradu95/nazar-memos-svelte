// src/routes/memos/+page.server.ts
import { db } from '$lib/server/db';
import { memos } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

const ITEMS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ url }) => {
    const page = Number(url.searchParams.get('page')) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const allMemos = await db
        .select()
        .from(memos)
        .orderBy(desc(memos.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);

    return {
        memos: allMemos,
        page,
        hasMore: allMemos.length === ITEMS_PER_PAGE
    };
};

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const content = data.get('content');
        const title = data.get('title');
        const visibility = data.get('visibility');
        const pinned = data.get('pinned') === 'true';

        if (!content) {
            return fail(400, { error: 'Content is required' });
        }

        try {
            const [memo] = await db.insert(memos).values({
                userId: 1, // TODO: Get from session
                title: title?.toString() || null,
                content: content.toString(),
                visibility: visibility?.toString() || 'private',
                pinned: pinned ? 1 : 0,
                createdAt: Math.floor(Date.now() / 1000),
                updatedAt: Math.floor(Date.now() / 1000)
            }).returning();

            return { memo };
        } catch (error) {
            console.error('Error creating memo:', error);
            return fail(500, { error: 'Failed to create memo' });
        }
    },

    loadMore: async ({ request }) => {
        const data = await request.formData();
        const page = Number(data.get('page')) || 1;
        const offset = page * ITEMS_PER_PAGE;

        try {
            const moreMemos = await db
                .select()
                .from(memos)
                .orderBy(desc(memos.createdAt))
                .limit(ITEMS_PER_PAGE)
                .offset(offset);

            return {
                memos: moreMemos,
                hasMore: moreMemos.length === ITEMS_PER_PAGE
            };
        } catch (error) {
            console.error('Error loading more memos:', error);
            return fail(500, { error: 'Failed to load more memos' });
        }
    }
};