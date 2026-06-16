import { describe, it, expect } from 'vitest';
import { parseRssItems } from './news';

const FIXTURE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ynet</title>
    <item>
      <title>כותרת ראשונה</title>
      <link>https://www.ynet.co.il/articles/item1</link>
      <pubDate>Mon, 16 Jun 2026 10:00:00 +0300</pubDate>
    </item>
    <item>
      <title>כותרת שנייה</title>
      <link>https://www.ynet.co.il/articles/item2</link>
      <pubDate>Mon, 16 Jun 2026 09:30:00 +0300</pubDate>
    </item>
  </channel>
</rss>`;

describe('parseRssItems', () => {
  it('returns an array of NewsItems from valid RSS', () => {
    const items = parseRssItems(FIXTURE_XML, 'Ynet');
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('כותרת ראשונה');
    expect(items[0].source).toBe('Ynet');
    expect(items[0].link).toBe('https://www.ynet.co.il/articles/item1');
  });

  it('converts pubDate to an ISO string', () => {
    const items = parseRssItems(FIXTURE_XML, 'Ynet');
    expect(() => new Date(items[0].publishedAt).toISOString()).not.toThrow();
  });

  it('returns an empty array for a channel with no items', () => {
    const emptyXml = `<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>`;
    expect(parseRssItems(emptyXml, 'Calcalist')).toEqual([]);
  });

  it('returns an empty array for malformed XML', () => {
    expect(parseRssItems('<not valid xml', 'Ynet')).toEqual([]);
  });
});

// --- cache / fetch tests ---

import { vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const YNET_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item><title>ynet חדשה</title><link>https://www.ynet.co.il/a</link><pubDate>Mon, 16 Jun 2026 10:00:00 +0300</pubDate></item>
</channel></rss>`;

const CALCALIST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item><title>כלכליסט חדשה</title><link>https://www.calcalist.co.il/b</link><pubDate>Mon, 16 Jun 2026 09:00:00 +0300</pubDate></item>
</channel></rss>`;

describe('getNews', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  it('returns items from both sources on success', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, text: async () => YNET_XML })
      .mockResolvedValueOnce({ ok: true, text: async () => CALCALIST_XML });
    const { getNews } = await import('./news');
    const items = await getNews();
    expect(items.some((i) => i.source === 'Ynet')).toBe(true);
    expect(items.some((i) => i.source === 'Calcalist')).toBe(true);
  });

  it('returns partial results when one source fails', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, text: async () => YNET_XML })
      .mockRejectedValueOnce(new Error('Calcalist down'));
    const { getNews } = await import('./news');
    const items = await getNews();
    expect(items.some((i) => i.source === 'Ynet')).toBe(true);
    expect(items.every((i) => i.source !== 'Calcalist')).toBe(true);
  });

  it('returns empty array when all sources fail and cache is empty', async () => {
    mockFetch.mockRejectedValue(new Error('all down'));
    const { getNews } = await import('./news');
    expect(await getNews()).toEqual([]);
  });

  it('returns last-known-good when all sources fail after a successful fetch', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, text: async () => YNET_XML })
      .mockResolvedValueOnce({ ok: true, text: async () => CALCALIST_XML })
      .mockRejectedValue(new Error('all down'));
    const { getNews } = await import('./news');
    const first = await getNews();
    const second = await getNews();
    expect(second).toEqual(first);
  });
});
