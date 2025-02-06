<script lang="ts">
    export let colors: string[];
    export let selectedColor: string;
    export let name = "color";
</script>

<div class="flex flex-wrap gap-2">
    {#each colors as color}
        <label class="relative">
            <input
                type="radio"
                {name}
                value={color}
                checked={color === selectedColor}
                class="sr-only peer"
            >
            <div
                class="w-6 h-6 rounded-full cursor-pointer ring-2 ring-transparent peer-checked:ring-blue-500 peer-checked:ring-offset-1"
                style="background-color: {color}"
            ></div>
        </label>
    {/each}
</div>