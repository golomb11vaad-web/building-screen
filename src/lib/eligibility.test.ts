import { describe, expect, it } from 'vitest';
import { isEligible, sortForRotation } from './eligibility';
import type { Message } from './types';

export function baseMessage(overrides: Partial<Message> = {}): Message {
	return {
		id: 'm1',
		text: 'הודעה',
		style: 'plain',
		pinned: false,
		createdAt: '2026-06-01T00:00:00.000Z',
		updatedAt: '2026-06-01T00:00:00.000Z',
		...overrides
	};
}

describe('isEligible - expiry', () => {
	it('is not eligible when manually hidden', () => {
		expect(isEligible(baseMessage({ enabled: false }), new Date('2026-06-15T12:00:00.000Z'))).toBe(false);
	});
	it('is eligible when expiresAt is absent', () => {
		const now = new Date('2026-06-15T12:00:00.000Z');
		expect(isEligible(baseMessage(), now)).toBe(true);
	});

	it('is not eligible when expiresAt is in the past', () => {
		const now = new Date('2026-06-15T12:00:00.000Z');
		const message = baseMessage({ expiresAt: '2026-06-01T00:00:00.000Z' });
		expect(isEligible(message, now)).toBe(false);
	});

	it('is eligible when expiresAt is in the future', () => {
		const now = new Date('2026-06-15T12:00:00.000Z');
		const message = baseMessage({ expiresAt: '2026-12-31T00:00:00.000Z' });
		expect(isEligible(message, now)).toBe(true);
	});
});

describe('isEligible - day-of-week schedule', () => {
	it('is eligible when activeDays is absent', () => {
		const now = new Date('2026-06-15T12:00:00.000Z'); // Monday in Israel
		expect(isEligible(baseMessage(), now)).toBe(true);
	});

	it('is eligible when today matches activeDays', () => {
		const now = new Date('2026-06-19T12:00:00.000Z'); // Friday in Israel
		const message = baseMessage({ activeDays: ['friday'] });
		expect(isEligible(message, now)).toBe(true);
	});

	it('is not eligible when today does not match activeDays', () => {
		const now = new Date('2026-06-15T12:00:00.000Z'); // Monday in Israel
		const message = baseMessage({ activeDays: ['friday'] });
		expect(isEligible(message, now)).toBe(false);
	});
});

describe('isEligible - active date range', () => {
	it('is eligible when today is within activeFrom/activeUntil', () => {
		const now = new Date('2026-06-15T12:00:00.000Z');
		const message = baseMessage({ activeFrom: '2026-06-01', activeUntil: '2026-06-30' });
		expect(isEligible(message, now)).toBe(true);
	});

	it('is not eligible before activeFrom', () => {
		const now = new Date('2026-06-15T12:00:00.000Z');
		const message = baseMessage({ activeFrom: '2026-07-01' });
		expect(isEligible(message, now)).toBe(false);
	});

	it('is not eligible after activeUntil', () => {
		const now = new Date('2026-06-15T12:00:00.000Z');
		const message = baseMessage({ activeUntil: '2026-06-01' });
		expect(isEligible(message, now)).toBe(false);
	});
});

describe('sortForRotation', () => {
	it('lists pinned messages twice, before unpinned messages, ordered by createdAt', () => {
		const pinned = baseMessage({ id: 'p1', pinned: true, createdAt: '2026-06-01T00:00:00.000Z' });
		const unpinned1 = baseMessage({ id: 'u1', pinned: false, createdAt: '2026-06-02T00:00:00.000Z' });
		const unpinned2 = baseMessage({ id: 'u2', pinned: false, createdAt: '2026-06-03T00:00:00.000Z' });

		const result = sortForRotation([unpinned2, pinned, unpinned1]);

		expect(result.map((m) => m.id)).toEqual(['p1', 'p1', 'u1', 'u2']);
	});

	it('orders multiple pinned messages by createdAt, each appearing twice before any unpinned message', () => {
		const pinnedA = baseMessage({ id: 'pA', pinned: true, createdAt: '2026-06-02T00:00:00.000Z' });
		const pinnedB = baseMessage({ id: 'pB', pinned: true, createdAt: '2026-06-01T00:00:00.000Z' });
		const unpinned = baseMessage({ id: 'u1', pinned: false, createdAt: '2026-06-03T00:00:00.000Z' });

		const result = sortForRotation([pinnedA, unpinned, pinnedB]);

		expect(result.map((m) => m.id)).toEqual(['pB', 'pA', 'pB', 'pA', 'u1']);
	});
});
