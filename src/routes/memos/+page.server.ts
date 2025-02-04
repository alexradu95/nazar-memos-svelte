// src/routes/memos/+page.server.ts
import { db } from '$lib/server/db';
import { memos, memo_tags, tags } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // First, get all memos ordered by creation date (newest first)
        const allMemos = await db
            .select()
            .from(memos)
            .orderBy(desc(memos.createdAt));

        // Get all memo tags relationships and tags
        const memoTagsWithInfo = await db
            .select({
                memoId: memo_tags.memoId,
                tagId: tags.id,
                tagName: tags.name,
                tagColor: tags.color
            })
            .from(memo_tags)
            .innerJoin(tags, eq(memo_tags.tagId, tags.id));

        // Combine the data
        const memosWithTags = allMemos.map(memo => ({
            ...memo,
            tags: memoTagsWithInfo
                .filter(mt => mt.memoId === memo.id)
                .map(mt => ({
                    id: mt.tagId,
                    name: mt.tagName,
                    color: mt.tagColor
                }))
        }));

        return {
            memos: memosWithTags
        };
    } catch (error) {
        console.error('Error loading memos:', error);
        return {
            memos: []
        };
    }
};