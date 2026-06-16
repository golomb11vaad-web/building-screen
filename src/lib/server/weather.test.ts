import { describe, it, expect } from 'vitest';
import { parseWeather } from './weather';

const FIXTURE = {
  current_weather: { temperature: 28.6, weathercode: 0, windspeed: 12.3 },
  daily: {
    temperature_2m_max: [31.2],
    temperature_2m_min: [21.5],
  },
};

describe('parseWeather', () => {
  it('rounds temperature to nearest integer', () => {
    const result = parseWeather(FIXTURE);
    expect(result.temperatureCurrent).toBe(29);
    expect(result.temperatureMax).toBe(31);
    expect(result.temperatureMin).toBe(22);
  });

  it('maps WMO code 0 to Hebrew "שמש מלאה"', () => {
    const result = parseWeather(FIXTURE);
    expect(result.conditionLabel).toBe('שמש מלאה');
  });

  it('falls back to "לא ידוע" for an unknown WMO code', () => {
    const unknown = {
      ...FIXTURE,
      current_weather: { ...FIXTURE.current_weather, weathercode: 999 },
    };
    expect(parseWeather(unknown).conditionLabel).toBe('לא ידוע');
  });

  it('includes a fetchedAt ISO string', () => {
    const result = parseWeather(FIXTURE);
    expect(() => new Date(result.fetchedAt).toISOString()).not.toThrow();
  });
});

// --- cache / fetch tests ---

import { vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const OPEN_METEO_OK = {
  current_weather: { temperature: 25.0, weathercode: 1, windspeed: 8.0 },
  daily: { temperature_2m_max: [28.0], temperature_2m_min: [19.0] },
};

const LAT = '32.0853';
const LON = '34.7818';

describe('getWeather', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  it('returns WeatherData on a successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => OPEN_METEO_OK,
    });
    const { getWeather } = await import('./weather');
    const result = await getWeather(LAT, LON);
    expect(result).not.toBeNull();
    expect(result!.temperatureCurrent).toBe(25);
  });

  it('returns null when fetch fails and cache is empty', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));
    const { getWeather } = await import('./weather');
    const result = await getWeather(LAT, LON);
    expect(result).toBeNull();
  });

  it('returns last-known-good data when subsequent fetch fails', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => OPEN_METEO_OK })
      .mockRejectedValueOnce(new Error('network'));
    const { getWeather } = await import('./weather');
    await getWeather(LAT, LON); // populates cache
    const result = await getWeather(LAT, LON); // fails, returns cached
    expect(result).not.toBeNull();
    expect(result!.temperatureCurrent).toBe(25);
  });
});
