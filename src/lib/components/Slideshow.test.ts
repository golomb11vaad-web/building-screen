import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import Slideshow from './Slideshow.svelte';
import { CURATED_BACKGROUNDS } from '../curatedBackgrounds';
import type { ImageRef } from '../types';

afterEach(() => cleanup());

describe('Slideshow', () => {
	it('renders the first image as a background', () => {
		const images: ImageRef[] = [
			{ id: 'i1', source: 'curated', ref: 'warm-sand' },
			{ id: 'i2', source: 'curated', ref: 'citrus-light' }
		];

		const { container } = render(Slideshow, { images });

		const slide = container.querySelector('.slideshow') as HTMLElement;
		const warmSand = CURATED_BACKGROUNDS.find((bg) => bg.id === 'warm-sand');

		expect(slide).not.toBeNull();
		expect(slide.style.background).toBe(warmSand?.css);
	});
});
