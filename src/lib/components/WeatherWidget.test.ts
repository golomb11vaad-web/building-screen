import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import WeatherWidget from './WeatherWidget.svelte';
import type { WeatherData } from '$lib/types';

const WEATHER: WeatherData = {
  temperatureCurrent: 29,
  temperatureMax: 32,
  temperatureMin: 20,
  weatherCode: 0,
  conditionLabel: 'שמש מלאה',
  fetchedAt: '2026-06-16T10:00:00.000Z',
  forecast: [
    { date: '2026-06-17', weatherCode: 1, temperatureMax: 31, temperatureMin: 21 },
    { date: '2026-06-18', weatherCode: 2, temperatureMax: 30, temperatureMin: 20 },
    { date: '2026-06-19', weatherCode: 61, temperatureMax: 28, temperatureMin: 19 },
    { date: '2026-06-20', weatherCode: 3, temperatureMax: 29, temperatureMin: 20 }
  ]
};

describe('WeatherWidget', () => {
  it('renders the current temperature', () => {
    const { container } = render(WeatherWidget, { props: { weather: WEATHER } });
    expect(container.querySelector('.weather-temp')?.textContent).toBe('29°');
  });

  it('renders the Hebrew condition label', () => {
    const { getByText } = render(WeatherWidget, { props: { weather: WEATHER } });
    expect(getByText('שמש מלאה')).toBeTruthy();
  });

  it('renders the daily high and low', () => {
    const { container } = render(WeatherWidget, { props: { weather: WEATHER } });
    expect(container.textContent).toContain('32°');
    expect(container.textContent).toContain('20°');
  });

  it('renders the next four forecast days', () => {
    const { container } = render(WeatherWidget, { props: { weather: WEATHER } });
    expect(container.querySelectorAll('.weather-forecast__day')).toHaveLength(4);
  });

  it('renders the Hebrew placeholder when weather is null', () => {
    const { getByText } = render(WeatherWidget, { props: { weather: null } });
    expect(getByText('מזג האוויר אינו זמין')).toBeTruthy();
  });
});
