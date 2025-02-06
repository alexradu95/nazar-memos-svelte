// src/routes/tags/+page.server.ts
import { db } from '$lib/server/db';
import { tags, memo_tags } from '$lib/server/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Load all tags for the current user (using userId 1 for now)
    const userTags = await db
        .select()
        .from(tags)
        .where(eq(tags.userId, 1));

    // Get usage count for each tag
    const tagUsage = await db
        .select({
            tagId: memo_tags.tagId,
            count: sql`count(*)`
        })
        .from(memo_tags)
        .groupBy(memo_tags.tagId);

    // Combine the data
    const tagsWithCount = userTags.map(tag => ({
        ...tag,
        count: tagUsage.find(t => t.tagId === tag.id)?.count || 0
    }));

    return {
        tags: tagsWithCount
    };
};

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const color = data.get('color')?.toString() || '#3b82f6'; // Default blue

        if (!name) {
            return fail(400, { error: 'Tag name is required' });
        }

        try {
            // Check if tag already exists for this user
            const existingTag = await db
                .select()
                .from(tags)
                .where(and(eq(tags.userId, 1), eq(tags.name, name)))
                .limit(1);

            if (existingTag.length > 0) {
                return fail(400, { error: 'Tag already exists' });
            }

            // Create new tag
            const [newTag] = await db.insert(tags).values({
                userId: 1, // TODO: Get from session
                name,
                color
            }).returning();

            return { tag: newTag };
        } catch (error) {
            console.error('Error creating tag:', error);
            return fail(500, { error: 'Failed to create tag' });
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const tagId = Number(data.get('tagId'));

        if (!tagId) {
            return fail(400, { error: 'Tag ID is required' });
        }

        try {
            // Delete tag and its associations
            await db.transaction(async (tx) => {
                // First delete memo_tags associations
                await tx.delete(memo_tags)
                    .where(eq(memo_tags.tagId, tagId));
                
                // Then delete the tag
                await tx.delete(tags)
                    .where(and(eq(tags.id, tagId),eq(tags.userId, 1)));
            });

            return { success: true };
        } catch (error) {
            console.error('Error deleting tag:', error);
            return fail(500, { error: 'Failed to delete tag' });
        }
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const tagId = Number(data.get('tagId'));
        const name = data.get('name')?.toString();
        const color = data.get('color')?.toString();

        if (!tagId || !name) {
            return fail(400, { error: 'Tag ID and name are required' });
        }

        try {
            const [updatedTag] = await db.update(tags)
                .set({
                    name,
                    color,
                    userId: 1 // TODO: Get from session
                })
                .where(eq(tags.id, tagId))
                .returning();

            return { tag: updatedTag };
        } catch (error) {
            console.error('Error updating tag:', error);
            return fail(500, { error: 'Failed to update tag' });
        }
    }
};
