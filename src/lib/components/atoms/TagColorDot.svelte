<script lang="ts">
    let { color, size = "4" } = $props<{
        color: string | null;
        size?: string;
    }>();
    
    // Use a default color if null
    let displayColor = $derived(color ?? '#3b82f6');
</script>

<div
    class="rounded-full"
    class:w-4={size === "4"}
    class:h-4={size === "4"}
    class:w-6={size === "6"}
    class:h-6={size === "6"}
    style="background-color: {displayColor}"
/>
