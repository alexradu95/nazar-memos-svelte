<!-- src/routes/memos/+page.svelte -->
<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<svelte:head>
    <title>My Memos</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
    <!-- Create New Memo Button - Fixed at top -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 mb-6">
        <a 
            href="/memos/new"
            class="block w-full bg-white rounded-lg border border-gray-300 p-4 hover:bg-gray-50 transition-colors"
        >
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                <div class="text-gray-500">What's on your mind?</div>
            </div>
        </a>
    </div>

    {#if !data.memos}
        <div class="text-center py-8">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        </div>
    {:else if data.memos.length === 0}
        <div class="text-center py-8">
            <p class="text-gray-500">No memos yet. Create your first one!</p>
        </div>
    {:else}
        {#each data.memos as memo (memo.id)}
            <div 
                class="bg-white rounded-lg shadow-sm mb-4"
                in:fly="{{ y: 50, duration: 300 }}"
            >
                <div class="p-4">
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h2 class="font-semibold text-lg">
                                {memo.title || 'Untitled'}
                            </h2>
                            <div class="text-sm text-gray-500 flex items-center gap-2">
                                <span>{new Date(memo.createdAt * 1000).toLocaleDateString()}</span>
                                <span>•</span>
                                <span class="capitalize">{memo.visibility}</span>
                                {#if memo.pinned}
                                    <span>•</span>
                                    <span class="text-yellow-600">📌 Pinned</span>
                                {/if}
                            </div>
                        </div>
                        
                        <button class="text-gray-400 hover:text-gray-600 p-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="prose max-w-none mb-3">
                        {#if memo.content.length > 300}
                            <p>{memo.content.slice(0, 300)}... 
                                <button class="text-blue-600 hover:underline">See more</button>
                            </p>
                        {:else}
                            <p>{memo.content}</p>
                        {/if}
                    </div>

                    <!-- Tags -->
                    {#if memo.tags?.length}
                        <div class="flex flex-wrap gap-2 mt-4">
                            {#each memo.tags as tag}
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style="
                                        background-color: {tag.color}30;
                                        color: {tag.color};
                                        border: 1px solid {tag.color};
                                    "
                                >
                                    {tag.name}
                                </span>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    {/if}
</div>