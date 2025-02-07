<script lang="ts">
    import { page } from '$app/state';
    import NavLink from './atoms/NavLink.svelte';
    import NavButton from './atoms/NavButton.svelte';
    import Logo from './atoms/Logo.svelte';
    import UserProfile from './molecules/UserProfile.svelte';
</script>

<aside class="w-64 h-screen bg-white border-r">
    <div class="flex flex-col h-full">
        <div class="p-4">
            <Logo />
        </div>
        
        <nav class="flex-1 mt-4">
            <div class="px-2 space-y-1">
                <NavLink href="/memos">
                    Memos
                </NavLink>
                <NavLink href="/tags">
                    Tags & Categories
                </NavLink>
            </div>
        </nav>

        <div class="p-4 border-t">
            {#if page.data.user}
                <UserProfile user={page.data.user} />
            {:else}
                <NavLink href="/auth/login">
                    Login
                </NavLink>
            {/if}
        </div>
    </div>
</aside>