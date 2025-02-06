<script lang="ts">
    export let name: string;
    export let color: string;
</script>

<span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    style="
        background-color: {color}30;
        color: {color};
        border: 1px solid {color};
    "
>
    {name}
</span>