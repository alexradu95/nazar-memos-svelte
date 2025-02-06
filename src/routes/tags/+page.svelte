<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';
    import type { PageData, ActionData } from './$types';
    import type { Tag } from '$lib/server/db/schema';
    import TagForm from '$lib/components/molecules/TagForm.svelte';
    import TagCard from '$lib/components/organisms/TagCard.svelte';

    let { data, form } = $props<{
        data: PageData;
        form: ActionData | undefined;
    }>();

    let tags = $state(data.tags.map((tag: Tag) => ({
        ...tag,
        color: tag.color ?? '#3b82f6' // Default blue color if null
    })));
    
    let showNewTagForm = $state(false);
    let editingTagId = $state<number | null>(null);

    function handleTagEdit(tagId: number) {
        editingTagId = tagId;
    }

    function handleTagDelete(tagId: number) {
        tags = tags.filter((t: Tag) => t.id !== tagId);
    }
</script>

<svelte:head>
    <title>Manage Tags</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Manage Tags</h1>
        <button
            onclick={() => showNewTagForm = true}
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
            New Tag
        </button>
    </div>

    {#if form?.error}
        <div class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg" transition:fade>
            {form.error}
        </div>
    {/if}

    {#if showNewTagForm}
        <div class="mb-6 bg-white p-4 rounded-lg shadow-sm" transition:slide>
            <TagForm onCancel={() => showNewTagForm = false} />
        </div>
    {/if}

    <div class="space-y-4">
        {#each tags as tag (tag.id)}
            <div transition:slide>
                <TagCard
                    {tag}
                    isEditing={editingTagId === tag.id}
                    on:edit={() => handleTagEdit(tag.id)}
                    on:cancelEdit={() => editingTagId = null}
                    on:delete={({ detail }) => handleTagDelete(detail.id)}
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