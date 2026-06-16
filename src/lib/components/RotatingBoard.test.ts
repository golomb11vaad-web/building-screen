import { afterEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import { cleanup, render, screen } from '@testing-library/svelte';
import RotatingBoard from './RotatingBoard.svelte';
import type { Message } from '../types';

afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

function makeMessage(overrides: Partial<Message> = {}): Message {
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

describe('RotatingBoard - empty state', () => {
	it('shows a friendly Hebrew message when there are no messages', () => {
		render(RotatingBoard, { messages: [] });
		expect(screen.getByText('יום נעים מלא בחיוכים!')).toBeInTheDocument();
	});
});

describe('RotatingBoard - rotation', () => {
	it('shows the first message initially', () => {
		const messages = [
			makeMessage({ id: 'm1', text: 'הודעה ראשונה' }),
			makeMessage({ id: 'm2', text: 'הודעה שנייה' })
		];

		render(RotatingBoard, { messages });

		expect(screen.getByText('הודעה ראשונה')).toBeInTheDocument();
	});

	it('advances to the next message after the rotation interval', async () => {
		vi.useFakeTimers();

		const messages = [
			makeMessage({ id: 'm1', text: 'הודעה ראשונה' }),
			makeMessage({ id: 'm2', text: 'הודעה שנייה' })
		];

		render(RotatingBoard, { messages });
		vi.advanceTimersByTime(8000);
		await tick();

		expect(screen.getByText('הודעה שנייה')).toBeInTheDocument();
	});
});
