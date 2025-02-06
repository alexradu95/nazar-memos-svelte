<script lang="ts">
    import EmojiPicker from '../atoms/EmojiPicker.svelte';
    
    let { 
        name = "", 
        icon = "📁",
        description = "",
        action = "?/createCategory",  // Default to createCategory action
        submitLabel = "Create Category",
        onCancel 
    } = $props<{
        name?: string;
        icon?: string;
        description?: string;
        action?: string;
        submitLabel?: string;
        onCancel: () => void;
    }>();
    
    let selectedIcon = $state(icon);
</script>

<form
    method="POST"
    {action}
    class="space-y-4"
>
    <div>
        <label for="icon" class="block text-sm font-medium text-gray-700">
            Icon
        </label>
        <div class="mt-1">
            <EmojiPicker bind:value={selectedIcon} />
            <input type="hidden" name="icon" value={selectedIcon}>
        </div>
    </div>

    <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
            Category Name
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
        <label for="description" class="block text-sm font-medium text-gray-700">
            Description (Optional)
        </label>
        <textarea
            id="description"
            name="description"
            rows="3"
            value={description}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
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