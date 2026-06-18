import type { HebrewDateData } from '$lib/types';

const HEBREW_DATE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

type CacheEntry = { data: HebrewDateData; fetchedAt: number };
let cache: CacheEntry | null = null;

type HebcalConverterResponse = {
  hebrew: string;
};

type HebcalShabbatResponse = {
  items?: Array<{
    category: string;
    hebrew?: string;
    title?: string;
  }>;
};

export async function getHebrewDate(): Promise<HebrewDateData | null> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < HEBREW_DATE_TTL_MS) return cache.data;

  try {
    const today = new Date();
    const gy = today.getFullYear();
    const gm = today.getMonth() + 1;
    const gd = today.getDate();

    const converterUrl =
      `https://www.hebcal.com/converter?cfg=json&gs=on&g2h=1` +
      `&gy=${gy}&gm=${gm}&gd=${gd}`;

    const shabbatUrl =
      `https://www.hebcal.com/shabbat?cfg=json&m=0&lg=he`;

    const [converterRes, shabbatRes] = await Promise.allSettled([
      fetch(converterUrl),
      fetch(shabbatUrl),
    ]);

    let hebrew = '';
    if (converterRes.status === 'fulfilled' && converterRes.value.ok) {
      const converterData: HebcalConverterResponse = await converterRes.value.json();
      hebrew = converterData.hebrew || '';
    }

    if (!hebrew) return cache?.data ?? null;

    let parasha: string | null = null;
    if (shabbatRes.status === 'fulfilled' && shabbatRes.value.ok) {
      const shabbatData: HebcalShabbatResponse = await shabbatRes.value.json();
      const parashaItem = shabbatData.items?.find(
        (item) => item.category === 'parashat'
      );
      if (parashaItem) {
        parasha = parashaItem.hebrew || parashaItem.title || null;
      }
    }

    const data: HebrewDateData = { hebrew, parasha };
    cache = { data, fetchedAt: now };
    return data;
  } catch {
    return cache?.data ?? null;
  }
}
