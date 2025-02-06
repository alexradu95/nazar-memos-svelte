<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';

    let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="shrink-0 flex items-center">
                        <a href="/" class="text-xl font-bold text-gray-900">
                            Memo App
                        </a>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a 
                            href="/memos"
                            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Memos
                        </a>
                        <a 
                            href="/tags"
                            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Tags
                        </a>
                        <a 
                            href="/tags/categories"
                            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Categories
                        </a>
                    </div>
                </div>

                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    {#if $page.data.user}
                        <div class="relative ml-3 flex items-center gap-4">
                            <span class="text-sm text-gray-700">
                                {$page.data.user.username}
                            </span>
                            <form action="/auth/logout" method="POST">
                                <button
                                    type="submit"
                                    class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    {:else}
                        <a
                            href="/auth/login"
                            class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Login
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </nav>

    <main>
        {@render children()}
    </main>
</div>