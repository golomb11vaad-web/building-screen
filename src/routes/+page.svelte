<script lang="ts">
	import RotatingBoard from '$lib/components/RotatingBoard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<RotatingBoard messages={data.rotation} />
