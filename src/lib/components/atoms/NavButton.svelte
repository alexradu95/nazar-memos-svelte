<script lang="ts">
    export let type: "submit" | "button" = "button";
</script>

<button
    {type}
    class="w-full text-left px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md"
>
    <slot />
</button>