import { XMLParser } from 'fast-xml-parser';
import type { NewsItem } from '$lib/types';

const parser = new XMLParser({ ignoreAttributes: true });

export function parseRssItems(xml: string, source: NewsItem['source']): NewsItem[] {
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
const GLOBES_MARKETS_RSS = 'https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585';
const NEWS_TTL_MS = 60 * 60 * 1000;
const MAX_PER_SOURCE = 5;
const MAX_NEWS_AGE_MS = 48 * 60 * 60 * 1000;

type NewsCache = { data: NewsItem[]; fetchedAt: number };
let newsCache: NewsCache | null = null;

export function newestFreshNews(items: NewsItem[], now = Date.now()): NewsItem[] {
  return items
    .filter((item) => {
      const publishedAt = Date.parse(item.publishedAt);
      return Number.isFinite(publishedAt) && publishedAt <= now && now - publishedAt <= MAX_NEWS_AGE_MS;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

async function fetchSource(url: string, source: NewsItem['source']): Promise<NewsItem[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);
  const xml = await res.text();
  return parseRssItems(xml, source).slice(0, MAX_PER_SOURCE);
}

export async function getNews(): Promise<NewsItem[]> {
  const now = Date.now();
  if (newsCache && now - newsCache.fetchedAt < NEWS_TTL_MS) return newsCache.data;
  const [ynet, globes] = await Promise.allSettled([
    fetchSource(YNET_RSS, 'Ynet'),
    fetchSource(GLOBES_MARKETS_RSS, 'Globes'),
  ]);
  const items = newestFreshNews([
    ...(ynet.status === 'fulfilled' ? ynet.value : []),
    ...(globes.status === 'fulfilled' ? globes.value : []),
  ], now);
  if (items.length > 0) {
    newsCache = { data: items, fetchedAt: now };
    return items;
  }
  return newsCache?.data ?? [];
}
