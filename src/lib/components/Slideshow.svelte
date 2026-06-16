<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { ImageRef } from '../types';
	import { resolveBackgroundCss } from '../imageResolver';

	export let images: ImageRef[];
	export let intervalMs = 15000;

	let current = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	if (images.length > 1) {
		timer = setInterval(() => {
			current = (current + 1) % images.length;
		}, intervalMs);
	}

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="slideshow" style="background: {resolveBackgroundCss(images[current])}"></div>

<style>
	.slideshow {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		border-radius: 1rem;
		transition: background var(--motion-slideshow);
	}
</style>
