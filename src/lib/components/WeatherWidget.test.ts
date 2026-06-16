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
};

describe('WeatherWidget', () => {
  it('renders the current temperature', () => {
    const { getByText } = render(WeatherWidget, { props: { weather: WEATHER } });
    expect(getByText(/29°/)).toBeTruthy();
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

  it('renders the Hebrew placeholder when weather is null', () => {
    const { getByText } = render(WeatherWidget, { props: { weather: null } });
    expect(getByText('מזג האוויר אינו זמין')).toBeTruthy();
  });
});
