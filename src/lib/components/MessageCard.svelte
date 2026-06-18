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
	{#if message.style === 'background' || message.style === 'photoSlideshow'}
		<div class="message-card__scrim"></div>
	{/if}
	<p class="message-card__text">{message.text}</p>
</article>

<style>
	.message-card {
		position: relative;
		padding: var(--space-safe-margin);
		overflow: hidden;
	}

	.message-card--background {
		background-size: cover;
		background-position: center;
	}

	.message-card__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(25, 18, 13, 0.75) 0%,
			rgba(25, 18, 13, 0.3) 100%
		);
		z-index: 1;
	}

	.message-card__text {
		position: relative;
		z-index: 2;
		font: var(--text-display-lg);
		letter-spacing: -0.02em;
		line-height: 100px;
		margin: 0;
		text-align: center;
		color: var(--color-on-surface);
	}
</style>
