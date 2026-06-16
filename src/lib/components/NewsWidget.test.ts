import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import NewsWidget from './NewsWidget.svelte';
import type { NewsItem } from '$lib/types';

const ITEMS: NewsItem[] = [
  {
    title: 'כותרת ראשונה',
    source: 'Ynet',
    link: 'https://www.ynet.co.il/a',
    publishedAt: '2026-06-16T10:00:00.000Z',
  },
  {
    title: 'כותרת שנייה',
    source: 'Calcalist',
    link: 'https://www.calcalist.co.il/b',
    publishedAt: '2026-06-16T09:00:00.000Z',
  },
];

describe('NewsWidget', () => {
  it('renders a headline for each news item', () => {
    const { getByText } = render(NewsWidget, { props: { items: ITEMS } });
    expect(getByText('כותרת ראשונה')).toBeTruthy();
    expect(getByText('כותרת שנייה')).toBeTruthy();
  });

  it('shows the source label alongside each item', () => {
    const { container } = render(NewsWidget, { props: { items: ITEMS } });
    expect(container.textContent).toContain('ynet');
    expect(container.textContent).toContain('כלכליסט');
  });

  it('renders the Hebrew placeholder when items is empty', () => {
    const { getByText } = render(NewsWidget, { props: { items: [] } });
    expect(getByText('חדשות אינן זמינות')).toBeTruthy();
  });

  it('does not use innerHTML for item titles', () => {
    const xss: NewsItem = {
      title: '<script>alert(1)</script>',
      source: 'Ynet',
      link: 'https://www.ynet.co.il/x',
      publishedAt: '2026-06-16T10:00:00.000Z',
    };
    const { container } = render(NewsWidget, { props: { items: [xss] } });
    expect(container.innerHTML).not.toContain('<script>');
  });
});
