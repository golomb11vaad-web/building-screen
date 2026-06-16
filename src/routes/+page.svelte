<script lang="ts">
  import { onDestroy } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import RotatingBoard from '$lib/components/RotatingBoard.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const REFRESH_MS = 3 * 60 * 1000;
  const refreshTimer = setInterval(() => { invalidateAll(); }, REFRESH_MS);
  onDestroy(() => { clearInterval(refreshTimer); });
</script>

<div class="display-layout">
  <main class="display-main">
    <RotatingBoard messages={data.rotation} />
  </main>
  <Sidebar weather={data.weather} news={data.news} />
</div>

<style>
  .display-layout {
    display: flex;
    height: 100vh;
  }
  .display-main {
    flex: 1;
    min-width: 0;
  }
</style>
