<script lang="ts">
    export let label = '';
</script>

<button 
    class="text-gray-400 hover:text-gray-600 p-1" 
    aria-label={label}
>
    <slot />
</button>
