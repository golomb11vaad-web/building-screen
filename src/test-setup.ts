import '@testing-library/jest-dom/vitest';

// Svelte 5 uses the Web Animations API for transitions; jsdom does not provide it.
if (!Element.prototype.animate) {
	Element.prototype.animate = () =>
		({
			cancel: () => undefined,
			finish: () => undefined,
			pause: () => undefined,
			play: () => undefined,
			reverse: () => undefined,
			playState: 'finished',
			finished: Promise.resolve()
		}) as Animation;
}

// jsdom has media elements but does not implement playback.
HTMLMediaElement.prototype.play = () => Promise.resolve();
