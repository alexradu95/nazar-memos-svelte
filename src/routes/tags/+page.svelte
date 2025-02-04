<!-- src/routes/tags/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    let tags = data.tags;
    let showNewTagForm = false;
    let editingTag: typeof tags[0] | null = null;

    const DEFAULT_COLORS = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // yellow
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#6366f1', // indigo
        '#14b8a6', // teal
    ];

    function handleNewTag(event: SubmitEvent) {
        showNewTagForm = false;
    }

    function handleEditTag(event: SubmitEvent) {
        editingTag = null;
    }

    function handleDeleteTag(event: SubmitEvent) {
        const form = event.target as HTMLFormElement;
        const tagId = new FormData(form).get('tagId');
        
        // Optimistically remove the tag
        tags = tags.filter(t => t.id !== Number(tagId));
    }
</script>

<svelte:head>
    <title>Manage Tags</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Manage Tags</h1>
        <button
            on:click={() => showNewTagForm = true}
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

    <!-- New Tag Form -->
    {#if showNewTagForm}
        <div class="mb-6 bg-white p-4 rounded-lg shadow" transition:slide>
            <form
                method="POST"
                action="?/create"
                use:enhance={handleNewTag}
                class="space-y-4"
            >
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">
                        Tag Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">
                        Color
                    </label>
                    <div class="mt-2 flex flex-wrap gap-2">
                        {#each DEFAULT_COLORS as color}
                            <label class="relative">
                                <input
                                    type="radio"
                                    name="color"
                                    value={color}
                                    class="sr-only peer"
                                >
                                <div
                                    class="w-8 h-8 rounded-full cursor-pointer ring-2 ring-transparent peer-checked:ring-blue-500 peer-checked:ring-offset-2"
                                    style="background-color: {color}"
                                ></div>
                            </label>
                        {/each}
                    </div>
                </div>

                <div class="flex justify-end gap-2">
                    <button
                        type="button"
                        on:click={() => showNewTagForm = false}
                        class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Create Tag
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- Tags List -->
    <div class="space-y-4">
        {#each tags as tag (tag.id)}
            <div
                class="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                transition:slide
            >
                {#if editingTag?.id === tag.id}
                    <form
                        method="POST"
                        action="?/update"
                        use:enhance={handleEditTag}
                        class="flex-1 flex items-center gap-4"
                    >
                        <input type="hidden" name="tagId" value={tag.id}>
                        <input
                            type="text"
                            name="name"
                            value={tag.name}
                            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                        <div class="flex gap-2">
                            {#each DEFAULT_COLORS as color}
                                <label class="relative">
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color}
                                        checked={color === tag.color}
                                        class="sr-only peer"
                                    >
                                    <div
                                        class="w-6 h-6 rounded-full cursor-pointer ring-2 ring-transparent peer-checked:ring-blue-500 peer-checked:ring-offset-1"
                                        style="background-color: {color}"
                                    ></div>
                                </label>
                            {/each}
                        </div>
                        <div class="flex gap-2">
                            <button
                                type="button"
                                on:click={() => editingTag = null}
                                class="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                {:else}
                    <div class="flex items-center gap-3">
                        <div
                            class="w-4 h-4 rounded-full"
                            style="background-color: {tag.color}"
                        ></div>
                        <span class="font-medium">{tag.name}</span>
                        <span class="text-sm text-gray-500">
                            {tag.count} {tag.count === 1 ? 'memo' : 'memos'}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            on:click={() => editingTag = tag}
                            class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <form
                            method="POST"
                            action="?/delete"
                            use:enhance={handleDeleteTag}
                            class="inline"
                        >
                            <input type="hidden" name="tagId" value={tag.id}>
                            <button
                                type="submit"
                                class="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </form>
                    </div>
                {/if}
            </div>
        {/each}

        {#if tags.length === 0}
            <div class="text-center py-12 text-gray-500">
                No tags yet. Create your first tag to get started!
            </div>
        {/if}
    </div>
</div>