import type { WeatherData } from '$lib/types';

const WMO_LABELS: Record<number, string> = {
  0: 'שמש מלאה',
  1: 'בעיקר שמש',
  2: 'מעונן חלקית',
  3: 'מעונן',
  45: 'ערפל',
  48: 'ערפל קרח',
  51: 'טפטוף קל',
  53: 'טפטוף',
  55: 'טפטוף כבד',
  61: 'גשם קל',
  63: 'גשם',
  65: 'גשם כבד',
  71: 'שלג קל',
  73: 'שלג',
  75: 'שלג כבד',
  80: 'מקלחות קלות',
  81: 'מקלחות',
  82: 'מקלחות כבדות',
  95: 'סופת ברקים',
};

type OpenMeteoResponse = {
  current_weather: { temperature: number; weathercode: number };
  daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
};

export function parseWeather(json: OpenMeteoResponse): WeatherData {
  const { temperature, weathercode } = json.current_weather;
  const max = json.daily.temperature_2m_max[0];
  const min = json.daily.temperature_2m_min[0];
  return {
    temperatureCurrent: Math.round(temperature),
    temperatureMax: Math.round(max),
    temperatureMin: Math.round(min),
    weatherCode: weathercode,
    conditionLabel: WMO_LABELS[weathercode] ?? 'לא ידוע',
    fetchedAt: new Date().toISOString(),
  };
}

const WEATHER_TTL_MS = 30 * 60 * 1000;

type CacheEntry = { data: WeatherData; fetchedAt: number };
let cache: CacheEntry | null = null;

export async function getWeather(lat: string, lon: string): Promise<WeatherData | null> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < WEATHER_TTL_MS) return cache.data;
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true` +
      `&daily=temperature_2m_max,temperature_2m_min` +
      `&timezone=Asia%2FJerusalem`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = parseWeather(await res.json());
    cache = { data, fetchedAt: now };
    return data;
  } catch {
    return cache?.data ?? null;
  }
}
