<!-- src/routes/memos/new/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { PageData, ActionData } from './$types';
    import type { ActionResult } from '@sveltejs/kit';

    export let data: PageData;
    export let form: ActionData;

    let selectedTags: number[] = form?.data?.selectedTags || [];
    let previewMode = false;

    function toggleTag(tagId: number) {
        selectedTags = selectedTags.includes(tagId)
            ? selectedTags.filter(id => id !== tagId)
            : [...selectedTags, tagId];
    }

    function handleSubmit() {
        return async ({ result, update }: { 
            result: ActionResult,
            update: () => Promise<void>
        }) => {
            await update();
            
            if (result.type === 'success') {
                goto('/memos');
            }
        };
    }
</script>

<!-- Rest of your template remains the same -->
<svelte:head>
    <title>Create New Memo</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
    <div class="mb-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Create New Memo</h1>
        <a 
            href="/memos" 
            class="text-gray-600 hover:text-gray-900"
        >
            Cancel
        </a>
    </div>

    <form 
        method="POST" 
        use:enhance={handleSubmit}
        class="space-y-6 bg-white rounded-lg shadow-sm p-6"
    >
        {#if form?.error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <p class="text-sm text-red-700">{form.error}</p>
            </div>
        {/if}

        <!-- Title Field -->
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
                Title (Optional)
            </label>
            <input
                type="text"
                id="title"
                name="title"
                value={form?.data?.title || ''}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Give your memo a title"
            >
        </div>

        <!-- Content Field -->
        <div>
            <div class="flex justify-between items-center mb-1">
                <label for="content" class="block text-sm font-medium text-gray-700">
                    Content
                </label>
                <button
                    type="button"
                    on:click={() => previewMode = !previewMode}
                    class="text-sm text-blue-600 hover:text-blue-700"
                >
                    {previewMode ? 'Edit' : 'Preview'}
                </button>
            </div>
            
            {#if previewMode}
                <div class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 p-4 prose prose-sm max-w-none">
                    {@html form?.data?.content || ''}
                </div>
                <input type="hidden" name="content" value={form?.data?.content || ''}>
            {:else}
                <textarea
                    id="content"
                    name="content"
                    rows="8"
                    required
                    value={form?.data?.content || ''}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Write your memo here..."
                ></textarea>
            {/if}
        </div>

        <!-- Tags Section -->
        <div>
            <label for="tags-group" class="block text-sm font-medium text-gray-700 mb-2">
                Tags
            </label>
            <div id="tags-group" class="flex flex-wrap gap-2">
                {#each data.tags as tag}
                    <label 
                        class="inline-flex items-center px-3 py-1.5 rounded-full border cursor-pointer transition-colors"
                        style="
                            background-color: {selectedTags.includes(tag.id) ? tag.color + '30' : 'transparent'};
                            border-color: {tag.color};
                        "
                    >
                        <input
                            type="checkbox"
                            name="tags[]"
                            value={tag.id}
                            checked={selectedTags.includes(tag.id)}
                            on:change={() => toggleTag(tag.id)}
                            class="sr-only"
                        >
                        <span 
                            class="w-2 h-2 rounded-full mr-2"
                            style="background-color: {tag.color};"
                        ></span>
                        <span class="text-sm">
                            {tag.name}
                        </span>
                    </label>
                {/each}
                
                {#if data.tags.length === 0}
                    <p class="text-sm text-gray-500">
                        No tags available. 
                        <a href="/tags" class="text-blue-600 hover:underline">Create some tags</a>
                    </p>
                {/if}
            </div>
        </div>

        <!-- Visibility and Pin Controls -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="visibility" class="block text-sm font-medium text-gray-700">
                    Visibility
                </label>
                <select
                    id="visibility"
                    name="visibility"
                    value={form?.data?.visibility || 'private'}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
            </div>

            <div class="flex items-center">
                <input
                    type="checkbox"
                    id="pinned"
                    name="pinned"
                    value="true"
                    checked={form?.data?.pinned || false}
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <label for="pinned" class="ml-2 block text-sm text-gray-900">
                    Pin this memo
                </label>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
            <button
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Create Memo
            </button>
        </div>
    </form>
</div>