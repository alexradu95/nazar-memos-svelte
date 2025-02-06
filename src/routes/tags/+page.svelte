<!-- src/routes/tags/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';
    import type { PageData, ActionData } from './$types';
    import TagForm from '$lib/components/molecules/TagForm.svelte';
    import TagCard from '$lib/components/organisms/TagCard.svelte';

    export let data: PageData;
    export let form: ActionData;

    let tags = data.tags;
    let showNewTagForm = false;
    let editingTagId: number | null = null;

    function handleDelete(event: CustomEvent<{ id: number }>) {
        const { id } = event.detail;
        tags = tags.filter(t => t.id !== id);
    }
</script>

<svelte:head>
    <title>Manage Tags</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Manage Tags</h1>
        <div class="flex gap-2">
            <a
                href="/tags/categories"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Manage Categories
            </a>
            <button
                on:click={() => showNewTagForm = true}
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                New Tag
            </button>
        </div>
    </div>

    {#if form?.error}
        <div class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg" transition:fade>
            {form.error}
        </div>
    {/if}

    <!-- New Tag Form -->
    {#if showNewTagForm}
        <div class="mb-6 bg-white p-4 rounded-lg shadow-sm" transition:slide>
            <TagForm 
                onCancel={() => showNewTagForm = false} 
                categories={data.categories}
            />
        </div>
    {/if}

    <!-- Tags List -->
    <div class="space-y-4">
        {#each tags as tag (tag.id)}
            <div transition:slide>
                <TagCard
                    {tag}
                    categories={data.categories}
                    isEditing={editingTagId === tag.id}
                    on:edit={() => editingTagId = tag.id}
                    on:cancelEdit={() => editingTagId = null}
                    on:delete={handleDelete}
                />
            </div>
        {/each}

        {#if tags.length === 0}
            <div class="text-center py-12 text-gray-500">
                No tags yet. Create your first tag to get started!
            </div>
        {/if}
    </div>
</div>