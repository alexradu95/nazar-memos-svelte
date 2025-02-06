<script lang="ts">
    export let content: string;
    export let maxLength = 300;
</script>

<div class="prose max-w-none mb-3">
    {#if content.length > maxLength}
        <p>{content.slice(0, maxLength)}... 
            <button class="text-blue-600 hover:underline">See more</button>
        </p>
    {:else}
        <p>{content}</p>
    {/if}
</div>