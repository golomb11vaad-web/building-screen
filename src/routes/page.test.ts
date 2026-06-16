import { describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/private', () => ({
  ADMIN_PASSWORD: 'test-pw',
  SESSION_SECRET: 'test-secret',
  WEATHER_LAT: '32.0853',
  WEATHER_LON: '34.7818',
}));

vi.mock('$lib/server/weather', () => ({
  getWeather: vi.fn().mockResolvedValue(null),
}));

vi.mock('$lib/server/news', () => ({
  getNews: vi.fn().mockResolvedValue([]),
}));

import { load } from './+page.server';

describe('Message Board load function', () => {
  it('returns only eligible messages, with the pinned seed message listed twice', async () => {
    const result = await load({} as Parameters<typeof load>[0]);
    expect(result.rotation.length).toBeGreaterThan(0);
    expect(result.rotation.every((m) => m.id !== 'seed-expired')).toBe(true);
    expect(result.rotation.filter((m) => m.id === 'seed-pinned-plain')).toHaveLength(2);
  });

  it('includes weather and news in the return value', async () => {
    const result = await load({} as Parameters<typeof load>[0]);
    expect('weather' in result).toBe(true);
    expect('news' in result).toBe(true);
  });
});
