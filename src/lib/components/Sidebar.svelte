<script lang="ts">
  import type { WeatherData, NewsItem } from '$lib/types';
  import WeatherWidget from './WeatherWidget.svelte';
  import NewsWidget from './NewsWidget.svelte';
  export let weather: WeatherData | null;
  export let news: NewsItem[];
</script>

<aside class="sidebar">
  <WeatherWidget {weather} />
  <NewsWidget items={news} />
</aside>

<style>
  .sidebar {
    width: var(--sidebar-width, 28rem);
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--color-bg-card);
    border-inline-start: 1px solid var(--color-border);
    overflow: hidden;
  }
</style>
