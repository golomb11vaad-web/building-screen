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
				{#if messages[current].pinned}
					<div class="rotating-board__pinned-indicator">
						<span class="rotating-board__pinned-dot"></span>
						<span class="rotating-board__pinned-label">הודעה חשובה</span>
					</div>
				{/if}
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
		min-height: 100vh;
		padding: var(--space-safe-margin);
	}

	.rotating-board__slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.rotating-board__empty {
		font: var(--text-display-lg);
		color: var(--color-on-surface);
		text-align: center;
		letter-spacing: -0.02em;
	}

	.rotating-board__pinned-indicator {
		display: flex;
		align-items: center;
		gap: var(--space-stack-sm);
		margin-bottom: var(--space-stack-md);
	}

	.rotating-board__pinned-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-primary-container);
	}

	.rotating-board__pinned-label {
		font: var(--text-label-caps);
		color: var(--color-primary);
		letter-spacing: 0.05em;
	}
</style>
