<script lang="ts">
  import type { WeatherData, NewsItem, HebrewDateData, FinanceItem } from '$lib/types';
  import Clock from './Clock.svelte';
  import HebrewDate from './HebrewDate.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import FinanceWidget from './FinanceWidget.svelte';
  import NewsWidget from './NewsWidget.svelte';
  import BuildingInfo from './BuildingInfo.svelte';
  export let weather: WeatherData | null;
  export let news: NewsItem[];
  export let hebrewDate: HebrewDateData | null = null;
  export let finance: FinanceItem[] = [];
  export let buildingName: string = '';
  export let buildingPhones: string[] = [];
</script>

<aside class="sidebar">
  <Clock />
  {#if hebrewDate}
    <HebrewDate {hebrewDate} />
  {/if}
  <WeatherWidget {weather} />
  {#if finance.length > 0}
    <FinanceWidget items={finance} />
  {/if}
  <NewsWidget items={news} />
  {#if buildingName || buildingPhones.length > 0}
    <BuildingInfo {buildingName} phones={buildingPhones} />
  {/if}
</aside>

<style>
  .sidebar {
    width: var(--sidebar-width, 28rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-stack-lg);
    background: var(--color-surface-container);
    border-inline-start: 1px solid var(--color-outline-variant);
    padding: var(--space-stack-lg) var(--space-safe-margin);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .sidebar::-webkit-scrollbar {
    display: none;
  }
</style>
