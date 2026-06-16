import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import MessageCard from './MessageCard.svelte';
import type { Message } from '../types';
import { CURATED_BACKGROUNDS } from '../curatedBackgrounds';

afterEach(() => cleanup());

export function baseMessage(overrides: Partial<Message> = {}): Message {
	return {
		id: 'm1',
		text: 'שלום שכנים',
		style: 'plain',
		pinned: false,
		createdAt: '2026-06-01T00:00:00.000Z',
		updatedAt: '2026-06-01T00:00:00.000Z',
		...overrides
	};
}

describe('MessageCard - plain style', () => {
	it('renders the message text', () => {
		render(MessageCard, { message: baseMessage() });
		expect(screen.getByText('שלום שכנים')).toBeInTheDocument();
	});

	it('marks pinned messages distinctly', () => {
		const { container } = render(MessageCard, { message: baseMessage({ pinned: true }) });
		expect(container.querySelector('.message-card--pinned')).not.toBeNull();
	});
});

describe('MessageCard - background style', () => {
	it('applies the curated background gradient', () => {
		const { container } = render(MessageCard, {
			message: baseMessage({
				style: 'background',
				images: [{ id: 'img1', source: 'curated', ref: 'soft-sky' }]
			})
		});

		const curated = CURATED_BACKGROUNDS.find((bg) => bg.id === 'soft-sky');
		const article = container.querySelector('.message-card--background') as HTMLElement;

		expect(article.style.background).toBe(curated?.css);
	});
});

describe('MessageCard - photoSlideshow style', () => {
	it('renders a slideshow with the message text overlaid', () => {
		const { container, getByText } = render(MessageCard, {
			message: baseMessage({
				style: 'photoSlideshow',
				text: 'שבת שלום',
				images: [
					{ id: 'i1', source: 'curated', ref: 'warm-sand' },
					{ id: 'i2', source: 'curated', ref: 'citrus-light' }
				]
			})
		});

		expect(container.querySelector('.slideshow')).not.toBeNull();
		expect(getByText('שבת שלום')).toBeInTheDocument();
	});
});
