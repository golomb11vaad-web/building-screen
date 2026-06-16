<script lang="ts">
  import { onDestroy } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import RotatingBoard from '$lib/components/RotatingBoard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const REFRESH_MS = 3 * 60 * 1000;

  const refreshTimer = setInterval(() => { invalidateAll(); }, REFRESH_MS);

  onDestroy(() => {
    clearInterval(refreshTimer);
  });
</script>

<RotatingBoard messages={data.rotation} />
