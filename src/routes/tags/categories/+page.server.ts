import { db } from '$lib/server/db';
import { tagCategories, tags } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    // Load categories with tag counts
    const categoriesWithCounts = await db
        .select({
            id: tagCategories.id,
            name: tagCategories.name,
            icon: tagCategories.icon,
            description: tagCategories.description,
            createdAt: tagCategories.createdAt,
            tagCount: sql<number>`count(${tags.id})`
        })
        .from(tagCategories)
        .leftJoin(tags, eq(tags.categoryId, tagCategories.id))
        .groupBy(tagCategories.id)
        .orderBy(tagCategories.name);

    return {
        categories: categoriesWithCounts
    };
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const icon = data.get('icon')?.toString() || '📁';
        const description = data.get('description')?.toString();

        if (!name?.trim()) {
            return fail(400, { error: 'Category name is required' });
        }

        try {
            // Check if category already exists
            const existing = await db
                .select()
                .from(tagCategories)
                .where(eq(tagCategories.name, name))
                .limit(1);

            if (existing.length > 0) {
                return fail(400, { error: 'Category already exists' });
            }

            const [category] = await db.insert(tagCategories)
                .values({
                    userId: 1, // TODO: Get from session
                    name,
                    icon,
                    description: description || null
                })
                .returning();

            return { category };
        } catch (error) {
            console.error('Error creating category:', error);
            return fail(500, { error: 'Failed to create category' });
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const categoryId = Number(data.get('categoryId'));

        if (!categoryId) {
            return fail(400, { error: 'Category ID is required' });
        }

        try {
            // First update any tags in this category to have no category
            await db.update(tags)
                .set({ categoryId: null })
                .where(eq(tags.categoryId, categoryId));

            // Then delete the category
            await db.delete(tagCategories)
                .where(eq(tagCategories.id, categoryId));

            return { success: true };
        } catch (error) {
            console.error('Error deleting category:', error);
            return fail(500, { error: 'Failed to delete category' });
        }
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const categoryId = Number(data.get('categoryId'));
        const name = data.get('name')?.toString();
        const icon = data.get('icon')?.toString();
        const description = data.get('description')?.toString();

        if (!categoryId || !name?.trim()) {
            return fail(400, { error: 'Category ID and name are required' });
        }

        try {
            const [category] = await db.update(tagCategories)
                .set({
                    name,
                    icon,
                    description: description || null
                })
                .where(eq(tagCategories.id, categoryId))
                .returning();

            return { category };
        } catch (error) {
            console.error('Error updating category:', error);
            return fail(500, { error: 'Failed to update category' });
        }
    }
} satisfies Actions;