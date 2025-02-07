<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import NavigationBar from '../lib/components/NavigationBar.svelte';
    import '../app.css';
  
      let { children } = $props();
  </script>
  
  <div class="min-h-screen bg-gray-50 flex">
      <NavigationBar />
      <main class="flex-1 p-8">
          {@render children()}
      </main>
  </div>