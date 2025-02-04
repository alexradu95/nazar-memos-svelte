// src/routes/memos/+page.svelte
<script lang="ts">
import { onMount } from 'svelte';
import type { PageData } from './$types';

interface Memo {
    id: number;
    title: string;
    content: string;
    visibility: string;
    pinned: number;
    createdAt: number;
    updatedAt: number;
}

let memos: Memo[] = [];
let loading = true;
let error: string | null = null;

onMount(async () => {
    try {
        const response = await fetch('/api/memos');
        if (!response.ok) throw new Error('Failed to fetch memos');
        const data = await response.json();
        memos = data.memos;
    } catch (e) {
        error = e instanceof Error ? e.message : 'An error occurred';
    } finally {
        loading = false;
    }
});
</script>

<svelte:head>
    <title>My Memos</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Memos</h1>
        <a 
            href="/memos/new" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
            New Memo
        </a>
    </div>

    {#if loading}
        <div class="text-center py-8">
            <p>Loading...</p>
        </div>
    {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
        </div>
    {:else if memos.length === 0}
        <div class="text-center py-8">
            <p>No memos yet. Create your first one!</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each memos as memo (memo.id)}
                <div class="border rounded p-4 hover:shadow-lg transition-shadow">
                    <div class="flex justify-between items-start mb-2">
                        <h2 class="text-xl font-semibold">
                            {memo.title || 'Untitled'}
                        </h2>
                        {#if memo.pinned}
                            <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                Pinned
                            </span>
                        {/if}
                    </div>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        {memo.content}
                    </p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>{new Date(memo.createdAt * 1000).toLocaleDateString()}</span>
                        <span class="capitalize">{memo.visibility}</span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>