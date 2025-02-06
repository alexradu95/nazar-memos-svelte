// src/routes/tags/+page.server.ts
import { db } from '$lib/server/db';
import { tags, tagCategories } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    // Load categories with counts
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

    // Load all tags
    const allTags = await db
        .select()
        .from(tags)
        .orderBy(tags.name);

    return {
        categories: categoriesWithCounts,
        tags: allTags
    };
}) satisfies PageServerLoad;

export const actions = {
    createTag: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const color = data.get('color')?.toString() || '#3b82f6';
        const categoryId = data.get('categoryId')?.toString();

        if (!name) {
            return fail(400, { error: 'Tag name is required' });
        }

        try {
            const [tag] = await db.insert(tags)
                .values({
                    userId: 1, // TODO: Get from session
                    name,
                    color,
                    categoryId: categoryId ? parseInt(categoryId) : null
                })
                .returning();

            return { tag };
        } catch (error) {
            console.error('Error creating tag:', error);
            return fail(500, { error: 'Failed to create tag' });
        }
    },

    update: async ({ request }) => {
        const data = await request.formData();
        const tagId = Number(data.get('tagId'));
        const name = data.get('name')?.toString();
        const color = data.get('color')?.toString();
        const categoryId = data.get('categoryId')?.toString();

        if (!tagId || !name) {
            return fail(400, { error: 'Tag ID and name are required' });
        }

        try {
            const [updatedTag] = await db.update(tags)
                .set({
                    name,
                    color,
                    categoryId: categoryId ? parseInt(categoryId) : null
                })
                .where(eq(tags.id, tagId))
                .returning();

            return { tag: updatedTag };
        } catch (error) {
            console.error('Error updating tag:', error);
            return fail(500, { error: 'Failed to update tag' });
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const tagId = Number(data.get('tagId'));

        if (!tagId) {
            return fail(400, { error: 'Tag ID is required' });
        }

        try {
            await db.delete(tags)
                .where(eq(tags.id, tagId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting tag:', error);
            return fail(500, { error: 'Failed to delete tag' });
        }
    },

    createCategory: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const icon = data.get('icon')?.toString() || '📁';
        const description = data.get('description')?.toString();

        if (!name) {
            return fail(400, { error: 'Category name is required' });
        }

        try {
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

    updateCategory: async ({ request }) => {
        const data = await request.formData();
        const categoryId = Number(data.get('categoryId'));
        const name = data.get('name')?.toString();
        const icon = data.get('icon')?.toString();
        const description = data.get('description')?.toString();

        if (!categoryId || !name) {
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
    },

    deleteCategory: async ({ request }) => {
        const data = await request.formData();
        const categoryId = Number(data.get('categoryId'));

        if (!categoryId) {
            return fail(400, { error: 'Category ID is required' });
        }

        try {
            // Update tags to remove category
            await db.update(tags)
                .set({ categoryId: null })
                .where(eq(tags.categoryId, categoryId));

            // Delete category
            await db.delete(tagCategories)
                .where(eq(tagCategories.id, categoryId));

            return { success: true };
        } catch (error) {
            console.error('Error deleting category:', error);
            return fail(500, { error: 'Failed to delete category' });
        }
    }
} satisfies Actions;