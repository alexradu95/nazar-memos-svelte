<!-- src/routes/memos/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { fly } from 'svelte/transition';
    import type { PageData } from './$types';

    export let data: PageData;
    
    let memos = data.memos;
    let page = data.page;
    let hasMore = data.hasMore;
    let loading = false;

    // Handle form submissions with optimistic updates
    async function handleNewMemo(event: SubmitEvent) {
        const form = event.target as HTMLFormElement;
        const content = new FormData(form).get('content');
        
        if (content) {
            // Optimistically add the new memo
            const optimisticMemo = {
                id: Date.now(), // Temporary ID
                content: content.toString(),
                createdAt: Math.floor(Date.now() / 1000),
                updatedAt: Math.floor(Date.now() / 1000),
                visibility: 'private',
                pinned: 0,
                userId: 1,
                title: null
            };
            
            memos = [optimisticMemo, ...memos];
            form.reset();
        }
    }

    function formatDate(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return date.toLocaleDateString();
    }

    let loadMoreElement: HTMLDivElement;

    function setupIntersectionObserver() {
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loading = true;
                const form = document.createElement('form');
                const formData = new FormData();
                formData.append('page', (page + 1).toString());
                
                const response = await fetch('?/loadMore', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                if (result.data) {
                    memos = [...memos, ...result.data.memos];
                    hasMore = result.data.hasMore;
                    page++;
                }
                loading = false;
            }
        });

        if (loadMoreElement) {
            observer.observe(loadMoreElement);
            return () => observer.disconnect();
        }
    }

    $: if (loadMoreElement) setupIntersectionObserver();
</script>

<!-- Create New Memo Form -->
<div class="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
    <div class="max-w-2xl mx-auto">
        <form 
            method="POST" 
            action="?/create" 
            use:enhance={handleNewMemo} 
            class="bg-white rounded-lg border border-gray-300 p-4"
        >
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                <input
                    name="content"
                    class="flex-1 bg-transparent placeholder:text-gray-500 focus:outline-none"
                    placeholder="What's on your mind?"
                >
            </div>
            <input type="hidden" name="visibility" value="private">
        </form>
    </div>
</div>

<!-- Memos Feed -->
<div class="max-w-2xl mx-auto px-4 py-6">
    {#each memos as memo (memo.id)}
        <div 
            class="bg-white rounded-lg shadow mb-4"
            in:fly="{{ y: 50, duration: 300 }}"
        >
            <div class="p-4 border-b border-gray-100">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div>
                        <div class="font-semibold">
                            {memo.title || 'Untitled Memo'}
                        </div>
                        <div class="text-sm text-gray-500">
                            {formatDate(memo.createdAt)}
                            {#if memo.pinned}
                                <span class="ml-2 text-yellow-600">📌 Pinned</span>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4">
                <div class="prose max-w-none">
                    {#if memo.content.length > 300}
                        <p>{memo.content.slice(0, 300)}... 
                            <button class="text-blue-600 hover:underline">See more</button>
                        </p>
                    {:else}
                        <p>{memo.content}</p>
                    {/if}
                </div>
            </div>

            <div class="px-4 py-2 border-t border-gray-100">
                <div class="flex gap-4">
                    <form method="POST" action="?/toggleLike" class="flex-1">
                        <input type="hidden" name="memoId" value={memo.id}>
                        <button 
                            type="submit"
                            class="w-full flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-md"
                        >
                            <span>Like</span>
                        </button>
                    </form>
                    <button 
                        class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-md"
                    >
                        Comment
                    </button>
                    <button 
                        class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-md"
                    >
                        Share
                    </button>
                </div>
            </div>
        </div>
    {/each}

    <!-- Infinite Scroll Trigger -->
    <div bind:this={loadMoreElement} class="h-10">
        {#if loading}
            <div class="text-center py-4">
                <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            </div>
        {/if}
    </div>
</div>