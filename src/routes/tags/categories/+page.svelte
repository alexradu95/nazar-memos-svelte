<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import type { PageData, ActionData } from './$types';
    import CategoryForm from '$lib/components/molecules/CategoryForm.svelte';
    import CategoryCard from '$lib/components/organisms/CategoryCard.svelte';

    let { data, form } = $props<{
        data: PageData;
        form: ActionData | undefined;
    }>();

    let categories = $state(data.categories);
    let showNewCategoryForm = $state(false);
    let editingCategoryId = $state<number | null>(null);

    function handleCategoryEdit(categoryId: number) {
        editingCategoryId = categoryId;
    }

    function handleCategoryDelete(categoryId: number) {
        categories = categories.filter(c => c.id !== categoryId);
    }
</script>

<svelte:head>
    <title>Manage Tag Categories</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Manage Tag Categories</h1>
        <button
            onclick={() => showNewCategoryForm = true}
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
            New Category
        </button>
    </div>

    {#if form?.error}
        <div class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg" transition:fade>
            {form.error}
        </div>
    {/if}

    {#if showNewCategoryForm}
        <div class="mb-6 bg-white p-4 rounded-lg shadow-sm" transition:slide>
            <CategoryForm onCancel={() => showNewCategoryForm = false} />
        </div>
    {/if}

    <div class="space-y-4">
        {#each categories as category (category.id)}
            <div transition:slide>
                <CategoryCard
                    {category}
                    isEditing={editingCategoryId === category.id}
                    on:edit={() => handleCategoryEdit(category.id)}
                    on:cancelEdit={() => editingCategoryId = null}
                    on:delete={({ detail }) => handleCategoryDelete(detail.id)}
                />
            </div>
        {/each}

        {#if categories.length === 0}
            <div class="text-center py-12 text-gray-500">
                No categories yet. Create your first category to organize your tags!
            </div>
        {/if}
    </div>
</div>