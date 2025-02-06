<script lang="ts">
    export let label = '';
</script>

<button 
    class="text-gray-400 hover:text-gray-600 p-1" 
    aria-label={label}
>
    <slot />
</button>

// src/lib/components/atoms/TimeStamp.svelte
<script lang="ts">
    export let timestamp: number;
</script>

<span class="text-sm text-gray-500">
    {new Date(timestamp * 1000).toLocaleDateString()}
</span>