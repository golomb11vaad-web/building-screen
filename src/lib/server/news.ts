import { XMLParser } from 'fast-xml-parser';
import type { NewsItem } from '$lib/types';

const parser = new XMLParser({ ignoreAttributes: true });

export function parseRssItems(xml: string, source: 'Ynet' | 'Calcalist'): NewsItem[] {
  try {
    const result = parser.parse(xml);
    const rawItems = result?.rss?.channel?.item;
    if (!rawItems) return [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    return items
      .filter((item: Record<string, unknown>) => item.title && item.link)
      .map((item: Record<string, unknown>) => ({
        title: String(item.title),
        source,
        link: String(item.link),
        publishedAt: item.pubDate
          ? new Date(String(item.pubDate)).toISOString()
          : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

const YNET_RSS = 'https://www.ynet.co.il/Integration/StoryRss1854.xml';
const CALCALIST_RSS = 'https://www.calcalist.co.il/Rss/0,7340,L-8,00.xml';
const NEWS_TTL_MS = 15 * 60 * 1000;
const MAX_PER_SOURCE = 5;

type NewsCache = { data: NewsItem[]; fetchedAt: number };
let newsCache: NewsCache | null = null;

async function fetchSource(url: string, source: 'Ynet' | 'Calcalist'): Promise<NewsItem[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);
  const xml = await res.text();
  return parseRssItems(xml, source).slice(0, MAX_PER_SOURCE);
}

export async function getNews(): Promise<NewsItem[]> {
  const now = Date.now();
  if (newsCache && now - newsCache.fetchedAt < NEWS_TTL_MS) return newsCache.data;
  const [ynet, calcalist] = await Promise.allSettled([
    fetchSource(YNET_RSS, 'Ynet'),
    fetchSource(CALCALIST_RSS, 'Calcalist'),
  ]);
  const items = [
    ...(ynet.status === 'fulfilled' ? ynet.value : []),
    ...(calcalist.status === 'fulfilled' ? calcalist.value : []),
  ];
  if (items.length > 0) {
    newsCache = { data: items, fetchedAt: now };
    return items;
  }
  return newsCache?.data ?? [];
}
