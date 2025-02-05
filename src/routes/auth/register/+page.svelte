<!-- src/routes/auth/register/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    export let form: ActionData;

    let isSubmitting = false;
    let password = '';
    let confirmPassword = '';
    let passwordsMatch = true;

    function handleSubmit() {
        return async ({ update }: { update: () => Promise<void> }) => {
            isSubmitting = true;
            await update();
            isSubmitting = false;
        };
    }

    $: passwordsMatch = !confirmPassword || password === confirmPassword;
</script>

<svelte:head>
    <title>Register | Memo App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
            Already have an account?
            <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
                Sign in
            </a>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {#if form?.error}
                <div class="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    <p>{form.error}</p>
                    {#if form.errors}
                        <ul class="mt-2 list-disc list-inside">
                            {#each form.errors as error}
                                <li>{error}</li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            {/if}

            <form method="POST" use:enhance={handleSubmit} class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <div class="mt-1">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div class="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            bind:value={password}
                            required
                            class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                    </p>
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                        Confirm password
                    </label>
                    <div class="mt-1">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            bind:value={confirmPassword}
                            required
                            class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            class:border-red-300={!passwordsMatch}
                            class:ring-red-500={!passwordsMatch}
                        />
                    </div>
                    {#if !passwordsMatch}
                        <p class="mt-1 text-sm text-red-600">
                            Passwords do not match
                        </p>
                    {/if}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !passwordsMatch}
                        class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating account...' : 'Create account'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>