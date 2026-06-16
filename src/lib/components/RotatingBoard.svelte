<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Message } from '../types';
	import MessageCard from './MessageCard.svelte';

	export let messages: Message[];
	export let intervalMs = 8000;

	let current = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	if (messages.length > 1) {
		timer = setInterval(() => {
			current = (current + 1) % messages.length;
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
