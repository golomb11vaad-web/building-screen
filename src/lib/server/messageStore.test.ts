import { describe, expect, it } from 'vitest';
import { loadMessages } from './messageStore';

describe('loadMessages', () => {
	it('falls back to seed data covering every style, a pinned message, a scheduled message, and an expired message', () => {
		const messages = loadMessages();

		expect(messages.length).toBeGreaterThan(0);
		expect(messages.some((m) => m.style === 'plain')).toBe(true);
		expect(messages.some((m) => m.style === 'photoSlideshow')).toBe(true);
		expect(messages.some((m) => m.style === 'background')).toBe(true);
		expect(messages.some((m) => m.pinned)).toBe(true);
		expect(messages.some((m) => (m.activeDays?.length ?? 0) > 0)).toBe(true);
		expect(messages.some((m) => m.expiresAt)).toBe(true);
	});
});
