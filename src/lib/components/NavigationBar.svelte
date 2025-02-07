<script lang="ts">
    import { page } from '$app/state';
</script>

<aside class="w-64 h-screen bg-white border-r">
    <div class="flex flex-col h-full">
        <div class="p-4">
            <a href="/" class="text-xl font-bold text-gray-900">
                Memo App
            </a>
        </div>
        
        <nav class="flex-1 mt-4">
            <div class="px-2 space-y-1">
                <a 
                    href="/memos"
                    class="block px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md"
                >
                    Memos
                </a>
                <a 
                    href="/tags"
                    class="block px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md"
                >
                    Tags & Categories
                </a>
            </div>
        </nav>

        <div class="p-4 border-t">
            {#if page.data.user}
                <div class="space-y-2">
                    <span class="block text-sm text-gray-700">
                        {page.data.user.username}
                    </span>
                    <form action="/auth/logout" method="POST">
                        <button
                            type="submit"
                            class="w-full text-left px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            {:else}
                <a
                    href="/auth/login"
                    class="block px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md"
                >
                    Login
                </a>
            {/if}
        </div>
    </div>
</aside>