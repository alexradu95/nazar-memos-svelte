<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import TagColorDot from '../atoms/TagColorDot.svelte';
    import TagForm from '../molecules/TagForm.svelte';
    
    export let tag: {
        id: number;
        name: string;
        color: string;
        count: number;
    };
    export let isEditing = false;
    
    const dispatch = createEventDispatcher();
</script>

{#if isEditing}
    <div class="bg-white p-4 rounded-lg shadow-sm">
        <TagForm
            name={tag.name}
            color={tag.color}
            action="?/update"
            submitLabel="Save"
            onCancel={() => dispatch('cancelEdit')}
        >
            <input type="hidden" name="tagId" value={tag.id}>
        </TagForm>
    </div>
{:else}
    <div class="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-3">
            <TagColorDot color={tag.color} />
            <span class="font-medium">{tag.name}</span>
            <span class="text-sm text-gray-500">
                {tag.count} {tag.count === 1 ? 'memo' : 'memos'}
            </span>
        </div>
        <div class="flex items-center gap-2">
            <button
                on:click={() => dispatch('edit')}
                class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
            <form
                method="POST"
                action="?/delete"
                class="inline"
                on:submit|preventDefault={() => dispatch('delete', { id: tag.id })}
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
    </div>
{/if}