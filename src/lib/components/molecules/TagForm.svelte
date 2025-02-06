<script lang="ts">
    import ColorPicker from '../atoms/ColorPicker.svelte';
    import type { TagCategory } from '$lib/server/db/schema';
    
    let { 
        name = "", 
        color = "#3b82f6",
        categoryId = null,
        categories = [],
        action = "?/createTag",  // Default to createTag action
        submitLabel = "Create Tag",
        onCancel 
    } = $props<{
        name?: string;
        color?: string;
        categoryId?: number | null;
        categories?: TagCategory[];
        action?: string;
        submitLabel?: string;
        onCancel: () => void;
    }>();
    
    const DEFAULT_COLORS = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6',
    ];
</script>

<form
    method="POST"
    {action}
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
            value={name}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
        >
    </div>
    
    <div>
        <label class="block text-sm font-medium text-gray-700">
            Color
        </label>
        <div class="mt-2">
            <ColorPicker
                colors={DEFAULT_COLORS}
                selectedColor={color}
            />
        </div>
    </div>

    <div>
        <label for="categoryId" class="block text-sm font-medium text-gray-700">
            Category
        </label>
        <select
            id="categoryId"
            name="categoryId"
            value={categoryId ?? ''}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
        >
            <option value="">No Category</option>
            {#each categories as category}
                <option value={category.id}>{category.icon} {category.name}</option>
            {/each}
        </select>
    </div>

    <div class="flex justify-end gap-2">
        <button
            type="button"
            onclick={onCancel}
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
        >
            Cancel
        </button>
        <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
            {submitLabel}
        </button>
    </div>
</form>