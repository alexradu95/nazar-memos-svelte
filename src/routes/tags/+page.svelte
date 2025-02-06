<script lang="ts">
    import { slide } from 'svelte/transition';
    import type { PageData } from './$types';
    import type { Tag, TagCategory } from '$lib/server/db/schema';
    import TagForm from '$lib/components/molecules/TagForm.svelte';
    import CategoryForm from '$lib/components/molecules/CategoryForm.svelte';
    import TagCard from '$lib/components/organisms/TagCard.svelte';
    import CategoryCard from '$lib/components/organisms/CategoryCard.svelte';

    let { data } = $props<{
        data: PageData;
    }>();

    let categories = $state(data.categories);
    let tags = $state(data.tags);
    
    let showNewTagForm = $state(false);
    let showNewCategoryForm = $state(false);
    let editingTagId = $state<number | null>(null);
    let editingCategoryId = $state<number | null>(null);

    // Group tags by category using $derived
    const tagsByCategory = $derived(() => {
        const grouped = new Map<number | null, Tag[]>();
        // Add 'No Category' group
        grouped.set(null, tags.filter((t: { categoryId: any; }) => !t.categoryId));
        // Add category groups
        categories.forEach((cat: { id: number | null; }) => {
            grouped.set(cat.id, tags.filter((t: { categoryId: number | null; }) => t.categoryId === cat.id));
        });
        return grouped;
    });

    function handleTagEdit(tagId: number) {
        editingTagId = tagId;
    }

    function handleTagDelete(tagId: number) {
        tags = tags.filter((t: { id: number; }) => t.id !== tagId);
    }

    function handleCategoryEdit(categoryId: number) {
        editingCategoryId = categoryId;
    }

    function handleCategoryDelete(categoryId: number) {
        categories = categories.filter((c: { id: number; }) => c.id !== categoryId);
        // Update tags to remove deleted category
        tags = tags.map((t: { categoryId: number; }) => t.categoryId === categoryId ? { ...t, categoryId: null } : t);
    }
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Manage Tags</h1>
        <div class="flex gap-2">
            <button
                onclick={() => showNewCategoryForm = true}
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
                New Category
            </button>
            <button
                onclick={() => showNewTagForm = true}
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                New Tag
            </button>
        </div>
    </div>

    {#if showNewCategoryForm}
        <div class="mb-6 bg-white p-4 rounded-lg shadow-sm" transition:slide>
            <CategoryForm onCancel={() => showNewCategoryForm = false} />
        </div>
    {/if}

    {#if showNewTagForm}
        <div class="mb-6 bg-white p-4 rounded-lg shadow-sm" transition:slide>
            <TagForm 
                categories={categories}
                onCancel={() => showNewTagForm = false} 
            />
        </div>
    {/if}

    <div class="space-y-8">
        {#each categories as category (category.id)}
    <div class="space-y-4">
        <CategoryCard
            {category}
            isEditing={editingCategoryId === category.id}
            handleEdit={() => handleCategoryEdit(category.id)}
            handleCancelEdit={() => editingCategoryId = null}
            handleDelete={() => handleCategoryDelete(category.id)}
        />
        
        <div class="ml-8 space-y-4">
            {#each tagsByCategory().get(category.id) || [] as tag (tag.id)}
                <div transition:slide>
                    <TagCard
                        {tag}
                        categories={categories}
                        isEditing={editingTagId === tag.id}
                        handleEdit={() => handleTagEdit(tag.id)}
                        handleCancelEdit={() => editingTagId = null}
                        handleDelete={() => handleTagDelete(tag.id)}
                    />
                </div>
            {/each}
        </div>
    </div>
{/each}

<!-- Uncategorized Tags -->
<div class="space-y-4">
    <h2 class="text-lg font-medium text-gray-700">Uncategorized Tags</h2>
    {#each tagsByCategory().get(null) || [] as tag (tag.id)}
        <div transition:slide>
            <TagCard
                {tag}
                categories={categories}
                isEditing={editingTagId === tag.id}
                handleEdit={() => handleTagEdit(tag.id)}
                handleCancelEdit={() => editingTagId = null}
                handleDelete={() => handleTagDelete(tag.id)}
            />
        </div>
    {/each}
</div>
    </div>

    {#if categories.length === 0 && tags.length === 0}
        <div class="text-center py-12 text-gray-500">
            <p class="mb-4">No tags or categories yet. Get started by creating either!</p>
            <div class="flex justify-center gap-4">
                <button
                    onclick={() => showNewCategoryForm = true}
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Create Category
                </button>
                <button
                    onclick={() => showNewTagForm = true}
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create Tag
                </button>
            </div>
        </div>
    {/if}
</div>