import { describe, expect, it } from 'vitest';
import { WEEKDAYS } from './types';
import { CURATED_BACKGROUNDS } from './curatedBackgrounds';

describe('shared types and curated backgrounds', () => {
	it('defines all seven weekdays', () => {
		expect(WEEKDAYS).toHaveLength(7);
		expect(WEEKDAYS).toContain('sunday');
		expect(WEEKDAYS).toContain('saturday');
	});

	it('ships a curated background palette with id, label, and css', () => {
		expect(CURATED_BACKGROUNDS.length).toBeGreaterThanOrEqual(5);
		for (const bg of CURATED_BACKGROUNDS) {
			expect(bg.id).toBeTruthy();
			expect(bg.label).toBeTruthy();
			expect(bg.css).toContain('linear-gradient');
		}
	});
});
