<script lang="ts">
    import NavButton from '../atoms/NavButton.svelte';
    
    export let user: {
        username: string;
    };
</script>

<div class="space-y-2">
    <span class="block text-sm text-gray-700">
        {user.username}
    </span>
    <form action="/auth/logout" method="POST">
        <NavButton type="submit">
            Logout
        </NavButton>
    </form>
</div>