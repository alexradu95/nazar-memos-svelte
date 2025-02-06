<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { Memo } from '$lib/server/db/schema';
    import MemoHeader from '../molecules/MemoHeader.svelte';
    import MemoContent from '../molecules/MemoContent.svelte';
    import TagList from '../molecules/TagList.svelte';

    interface ExtendedMemo extends Memo {
        tags?: {
            id: number;
            name: string;
            color: string;
        }[];
    }

    export let memo: ExtendedMemo;
</script>

<div 
    class="bg-white rounded-lg shadow-sm mb-4"
    in:fly="{{ y: 50, duration: 300 }}"
>
    <div class="p-4">
        <MemoHeader 
            title={memo.title}
            createdAt={memo.createdAt}
            visibility={memo.visibility}
            pinned={Boolean(memo.pinned)}
        />
        
        <MemoContent content={memo.content} />
        
        <TagList tags={memo.tags || []} />
    </div>
</div>