<script lang="ts">
    export let type: 'visibility' | 'pinned';
    export let value: string | boolean;
</script>

{#if type === 'visibility'}
    <span class="capitalize">{value}</span>
{:else if type === 'pinned' && value}
    <span class="text-yellow-600">📌 Pinned</span>
{/if}