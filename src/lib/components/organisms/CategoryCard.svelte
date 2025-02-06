<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { TagCategory } from '$lib/server/db/schema';
    import CategoryForm from '../molecules/CategoryForm.svelte';

    interface CategoryWithCount extends TagCategory {
        tagCount: number;
    }

    let { category, isEditing } = $props<{
        category: CategoryWithCount;
        isEditing?: boolean;
    }>();

    const dispatch = createEventDispatcher<{
        edit: void;
        cancelEdit: void;
        delete: { id: number };
    }>();

    function handleDelete(e: Event) {
        e.preventDefault();
        dispatch('delete', { id: category.id });
    }
</script>

{#if isEditing}
    <div class="bg-white p-4 rounded-lg shadow-sm">
        <CategoryForm
            name={category.name}
            icon={category.icon}
            description={category.description ?? ''}
            action="?/update"
            submitLabel="Save"
            onCancel={() => dispatch('cancelEdit')}
        />
        <input type="hidden" name="categoryId" value={category.id}>
    </div>
{:else}
    <div class="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-3">
            <span class="text-2xl">{category.icon}</span>
            <div>
                <h3 class="font-medium">{category.name}</h3>
                {#if category.description}
                    <p class="text-sm text-gray-500">{category.description}</p>
                {/if}
                <p class="text-sm text-gray-500">
                    {category.tagCount} {category.tagCount === 1 ? 'tag' : 'tags'}
                </p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button
                onclick={() => dispatch('edit')}
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
                onsubmit={handleDelete}
            >
                <input type="hidden" name="categoryId" value={category.id}>
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