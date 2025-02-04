<!-- src/routes/memos/new/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    
    let title = '';
    let content = '';
    let visibility = 'private';
    let pinned = false;
    let error: string | null = null;
    let saving = false;

    async function handleSubmit() {
        if (!content.trim()) {
            error = 'Content is required';
            return;
        }

        saving = true;
        error = null;

        try {
            const response = await fetch('/api/memos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    visibility,
                    pinned
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create memo');
            }

            // Redirect to memos list
            await goto('/memos');
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to create memo';
        } finally {
            saving = false;
        }
    }
</script>

<svelte:head>
    <title>New Memo</title>
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

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        {#if error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                    <div class="flex-1">
                        <p class="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        {/if}

        <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
                Title
            </label>
            <input
                type="text"
                id="title"
                bind:value={title}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Optional title for your memo"
            />
        </div>

        <div>
            <label for="content" class="block text-sm font-medium text-gray-700">
                Content
            </label>
            <textarea
                id="content"
                bind:value={content}
                rows="8"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Write your memo here..."
            ></textarea>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="visibility" class="block text-sm font-medium text-gray-700">
                    Visibility
                </label>
                <select
                    id="visibility"
                    bind:value={visibility}
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
                    bind:checked={pinned}
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="pinned" class="ml-2 block text-sm text-gray-900">
                    Pin this memo
                </label>
            </div>
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                disabled={saving}
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? 'Saving...' : 'Create Memo'}
            </button>
        </div>
    </form>
</div>