<script lang="ts">
    export let timestamp: number;
</script>

<span class="text-sm text-gray-500">
    {new Date(timestamp * 1000).toLocaleDateString()}
</span>