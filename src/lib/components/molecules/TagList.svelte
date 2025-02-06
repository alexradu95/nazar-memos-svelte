<script lang="ts">
    import TagBadge from '../atoms/TagBadge.svelte';
    
    export let tags: Array<{ name: string; color: string; }>;
</script>

{#if tags?.length}
    <div class="flex flex-wrap gap-2 mt-4">
        {#each tags as tag}
            <TagBadge name={tag.name} color={tag.color} />
        {/each}
    </div>
{/if}