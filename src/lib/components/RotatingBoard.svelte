<script lang="ts">
	import { onDestroy } from 'svelte';
	// @ts-ignore – flush is not in Svelte 4's public types but is a stable runtime export
	import { flush } from 'svelte/internal';
	import type { Message } from '../types';
	import MessageCard from './MessageCard.svelte';

	export let messages: Message[];
	export let intervalMs = 8000;

	let current = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	if (messages.length > 1) {
		timer = setInterval(() => {
			current = (current + 1) % messages.length;
			flush();
		}, intervalMs);
	}

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="rotating-board">
	{#if messages.length === 0}
		<p class="rotating-board__empty">יום נעים מלא בחיוכים!</p>
	{:else}
		<MessageCard message={messages[current]} />
	{/if}
</div>

<style>
	.rotating-board {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: var(--space-lg);
	}

	.rotating-board__empty {
		font-size: var(--font-size-message);
		color: var(--color-text-muted);
		text-align: center;
	}
</style>
