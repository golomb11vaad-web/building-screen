<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
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
		{#key current}
			<div class="rotating-board__slide" transition:fade={{ duration: 400 }}>
				<MessageCard message={messages[current]} />
			</div>
		{/key}
	{/if}
</div>

<style>
	.rotating-board {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 0;
		padding: clamp(28px, 5vw, var(--space-safe-margin));
	}

	.rotating-board__slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.rotating-board__empty {
		font: var(--text-display-lg);
		color: var(--color-on-surface);
		text-align: center;
		letter-spacing: -0.02em;
		background: var(--color-surface-container-high);
		backdrop-filter: var(--blur-surface);
		padding: 1em 1.3em;
		border-radius: 32px;
		box-shadow: var(--shadow-soft);
	}

</style>
