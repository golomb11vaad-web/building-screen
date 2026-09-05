import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Sidebar from './Sidebar.svelte';

describe('Sidebar', () => {
  it('renders the weather placeholder when weather is null', () => {
    const { getByText } = render(Sidebar, { props: { weather: null, news: [] } });
    expect(getByText('מזג האוויר אינו זמין')).toBeTruthy();
  });

  it('renders the weather placeholder when weather is unavailable', () => {
    const { getByText } = render(Sidebar, { props: { weather: null } });
    expect(getByText('מזג האוויר אינו זמין')).toBeTruthy();
  });
});
