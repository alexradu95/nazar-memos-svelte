<script lang="ts">
    export let href: string;
</script>

<a 
    {href}
    class="block px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md"
>
    <slot />
</a>