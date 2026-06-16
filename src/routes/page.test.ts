import { describe, expect, it } from 'vitest';
import { load } from './+page.server';

describe('Message Board load function', () => {
	it('returns only eligible messages, with the pinned seed message listed twice', () => {
		const result = load() as unknown as ReturnType<
			() => { rotation: { id: string }[] }
		>;

		expect(result.rotation.length).toBeGreaterThan(0);
		expect(result.rotation.every((m) => m.id !== 'seed-expired')).toBe(true);
		expect(result.rotation.filter((m) => m.id === 'seed-pinned-plain')).toHaveLength(2);
	});
});
