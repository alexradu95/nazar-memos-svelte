<!-- src/lib/components/atoms/EmojiPicker.svelte -->
<script lang="ts">
    export let value = "📁";
    
    const commonEmojis = [
        "📁", "📚", "💼", "🏢", "🏠", "💻", "📱", "✏️", 
        "📝", "📌", "🎯", "💡", "⭐", "🎨", "🛠️", "🔧",
        "📊", "📈", "🎮", "🎵", "🎬", "🏃", "🍳", "🌟"
    ];

    let showPicker = false;
</script>

<div class="relative">
    <button
        type="button"
        on:click={() => showPicker = !showPicker}
        class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
    >
        <span class="text-xl">{value}</span>
        <span class="text-gray-500">Change</span>
    </button>

    {#if showPicker}
        <div 
            class="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
            on:focusout={() => showPicker = false}
        >
            <div class="grid grid-cols-6 gap-1">
                {#each commonEmojis as emoji}
                    <button
                        type="button"
                        class="p-2 hover:bg-gray-100 rounded"
                        on:click={() => {
                            value = emoji;
                            showPicker = false;
                        }}
                    >
                        {emoji}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>