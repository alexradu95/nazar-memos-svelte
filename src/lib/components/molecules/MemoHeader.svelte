<script lang="ts">
    import IconButton from '../atoms/IconButton.svelte';
    import TimeStamp from '../atoms/TimeStamp.svelte';
    import StatusIndicator from '../atoms/StatusIndicator.svelte';

    export let title: string;
    export let createdAt: number;
    export let visibility: string;
    export let pinned: boolean;
</script>

<div class="flex justify-between items-start mb-3">
    <div>
        <h2 class="font-semibold text-lg">
            {title || 'Untitled'}
        </h2>
        <div class="text-sm text-gray-500 flex items-center gap-2">
            <TimeStamp timestamp={createdAt} />
            <span>•</span>
            <StatusIndicator type="visibility" value={visibility} />
            {#if pinned}
                <span>•</span>
                <StatusIndicator type="pinned" value={pinned} />
            {/if}
        </div>
    </div>
    
    <IconButton label="Menu">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
    </IconButton>
</div>
