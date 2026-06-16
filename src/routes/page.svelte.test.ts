import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mockInvalidateAll = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('$app/navigation', () => ({
  invalidateAll: mockInvalidateAll
}));

import DisplayPage from './+page.svelte';
import type { Message } from '$lib/types';

const msg: Message = {
  id: 'm1',
  text: 'שלום',
  style: 'plain',
  pinned: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

describe('Display page refresh timer', () => {
  it('renders without error', () => {
    expect(() =>
      render(DisplayPage, { props: { data: { rotation: [msg] } } })
    ).not.toThrow();
  });

  it('calls invalidateAll after the refresh interval', async () => {
    vi.useFakeTimers();
    render(DisplayPage, { props: { data: { rotation: [msg] } } });
    vi.advanceTimersByTime(3 * 60 * 1000);
    expect(mockInvalidateAll).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
