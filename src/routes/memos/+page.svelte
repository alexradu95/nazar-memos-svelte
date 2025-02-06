<!-- src/routes/memos/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import MemoCard from '$lib/components/organisms/MemoCard.svelte';

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
            <MemoCard {memo} />
        {/each}
    {/if}
</div>