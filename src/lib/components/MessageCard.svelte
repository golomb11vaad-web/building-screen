<script lang="ts">
	import type { Message } from '../types';
	import { resolveBackgroundCss } from '../imageResolver';
	import Slideshow from './Slideshow.svelte';

	export let message: Message;

	$: backgroundCss =
		message.style === 'background' && message.images?.[0]
			? resolveBackgroundCss(message.images[0])
			: '';
</script>

<article
	class="message-card message-card--{message.style}"
	class:message-card--pinned={message.pinned}
	style={backgroundCss ? `background: ${backgroundCss}` : ''}
>
	{#if message.style === 'photoSlideshow' && message.images}
		<Slideshow images={message.images} />
	{/if}
	<p class="message-card__text">{message.text}</p>
</article>

<style>
	.message-card {
		position: relative;
		padding: var(--space-lg);
		border-radius: 1rem;
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.message-card--pinned {
		border-color: var(--color-pinned-accent);
		border-width: 3px;
	}

	.message-card--background {
		background-size: cover;
		background-position: center;
	}

	.message-card__text {
		position: relative;
		font-size: var(--font-size-message);
		line-height: 1.4;
		margin: 0;
		text-align: center;
	}

	.message-card--background .message-card__text,
	.message-card--photoSlideshow .message-card__text {
		color: var(--color-text);
		text-shadow: 0 1px 4px rgba(255, 255, 255, 0.6);
	}
</style>
