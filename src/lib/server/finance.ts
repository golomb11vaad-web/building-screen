import type { FinanceItem } from '$lib/types';

const FINANCE_TTL_MS = 60 * 60 * 1000; // 1 hour

type CacheEntry = { data: FinanceItem[]; fetchedAt: number; rates: Record<string, number> };
let cache: CacheEntry | null = null;

type ExchangeRateResponse = {
  rates: Record<string, number>;
};

function formatRate(rate: number): string {
  return rate.toFixed(2);
}

function computeChange(current: number, previous: number | undefined): string {
  if (previous === undefined) return '0.00';
  const diff = current - previous;
  const sign = diff >= 0 ? '+' : '';
  return `${sign}${diff.toFixed(2)}`;
}

export async function getFinanceData(): Promise<FinanceItem[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < FINANCE_TTL_MS) return cache.data;

  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/ILS');
    if (!res.ok) throw new Error(`Exchange rate API HTTP ${res.status}`);
    const json: ExchangeRateResponse = await res.json();

    const usdRate = json.rates['USD'];
    const eurRate = json.rates['EUR'];

    if (!usdRate || !eurRate) throw new Error('Missing USD or EUR rate');

    // Convert from ILS-based to foreign-per-ILS, then invert to ILS-per-foreign
    const usdIls = 1 / usdRate;
    const eurIls = 1 / eurRate;

    const previousRates = cache?.rates;
    const previousUsd = previousRates ? 1 / previousRates['USD'] : undefined;
    const previousEur = previousRates ? 1 / previousRates['EUR'] : undefined;

    const data: FinanceItem[] = [
      {
        label: 'USD/ILS',
        value: formatRate(usdIls),
        change: computeChange(usdIls, previousUsd),
      },
      {
        label: 'EUR/ILS',
        value: formatRate(eurIls),
        change: computeChange(eurIls, previousEur),
      },
    ];

    cache = { data, fetchedAt: now, rates: json.rates };
    return data;
  } catch {
    return cache?.data ?? [];
  }
}
