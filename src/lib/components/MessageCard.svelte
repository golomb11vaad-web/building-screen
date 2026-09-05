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
	style={backgroundCss ? `background-image: ${backgroundCss}` : ''}
>
	{#if message.style === 'photoSlideshow' && message.images}
		<Slideshow images={message.images} />
	{/if}
	{#if (message.style === 'background' || message.style === 'photoSlideshow') && message.text.trim()}
		<div class="message-card__scrim"></div>
	{/if}
	<div class="message-card__text message-card__text--{message.textSize ?? 'normal'}">{@html message.text.includes('<') ? message.text : message.text.replace(/\n/g, '<br>')}</div>
</article>

<style>
	.message-card {
		position: relative;
		width: min(100%, 980px);
		height: min(100%, 620px);
		min-height: 0;
		display: grid;
		place-items: center;
		padding: clamp(28px, 5vw, var(--space-safe-margin));
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.72);
		border-radius: 36px;
		background: var(--color-surface-container-high);
		backdrop-filter: var(--blur-surface);
		-webkit-backdrop-filter: var(--blur-surface);
		box-shadow: var(--shadow-soft);
	}

	.message-card--background {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		border-color: rgba(255, 255, 255, 0.34);
	}

	.message-card__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(5, 23, 32, 0.88), rgba(5, 23, 32, 0.42));
		z-index: 1;
	}

	.message-card__text {
		position: relative;
		z-index: 2;
		--message-font-size: clamp(44px, 5vw, 84px);
		font: 500 var(--message-font-size)/1.18 'Heebo', sans-serif;
		letter-spacing: -0.01em;
		margin: 0;
		text-align: center;
		white-space: pre-line;
		color: #fff;
		text-shadow: 0 3px 16px rgba(0, 0, 0, 0.75);
		text-wrap: balance;
	}

	.message-card__text--small { --message-font-size: clamp(24px, 2.7vw, 46px); }
	.message-card__text--large { --message-font-size: clamp(56px, 6.2vw, 98px); }

	.message-card__text :global(ul),
	.message-card__text :global(ol) {
		margin: 0.45em 0;
		padding-inline-start: 1.25em;
		text-align: start;
	}

	.message-card__text :global(a) { color: inherit; }
</style>
