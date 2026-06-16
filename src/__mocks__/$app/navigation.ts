import { vi } from 'vitest';

export const invalidateAll = vi.fn().mockResolvedValue(undefined);
export const goto = vi.fn().mockResolvedValue(undefined);
export const beforeNavigate = vi.fn();
export const afterNavigate = vi.fn();
export const invalidate = vi.fn().mockResolvedValue(undefined);
export const preloadCode = vi.fn().mockResolvedValue(undefined);
export const preloadData = vi.fn().mockResolvedValue(undefined);
