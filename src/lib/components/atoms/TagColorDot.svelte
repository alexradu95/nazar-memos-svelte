<script lang="ts">
    export let color: string;
    export let size = "4";
</script>

<div
    class="rounded-full"
    class:w-4={size === "4"}
    class:h-4={size === "4"}
    class:w-6={size === "6"}
    class:h-6={size === "6"}
    style="background-color: {color}"
></div>