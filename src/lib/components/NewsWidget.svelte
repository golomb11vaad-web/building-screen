<script lang="ts">
  import type { NewsItem } from '$lib/types';
  export let items: NewsItem[];
  export let heading = 'חדשות';

  function sourceLabel(source: NewsItem['source']): string {
    if (source === 'Ynet') return 'ynet';
    if (source === 'Globes') return 'גלובס';
    return 'כלכליסט';
  }
</script>

<div class="news-widget">
  <h2 class="news-heading">{heading}</h2>
  {#if items.length === 0}
    <p class="news-placeholder">חדשות אינן זמינות</p>
  {:else}
    <ul class="news-list">
      {#each items as item (item.link)}
        <li class="news-item">
          <span class="news-source">{sourceLabel(item.source)}</span>
          <span class="news-title">{item.title}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .news-widget {
    padding: 0;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .news-heading {
    font: var(--text-label-caps);
    color: var(--color-primary-container);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 clamp(6px, 1vh, 14px);
  }

  .news-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 1vh, 14px);
  }

  .news-item {
    border-bottom: 1px solid var(--color-outline-variant);
    padding-bottom: clamp(6px, 1vh, 14px);
    line-height: 1.3;
  }

  .news-source {
    display: block;
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }

  .news-title {
    font: 400 clamp(16px, 1.35vw, 21px)/1.35 'Heebo', sans-serif;
    color: var(--color-on-surface);
  }

  .news-placeholder {
    font: 400 clamp(16px, 1.35vw, 21px)/1.35 'Heebo', sans-serif;
    color: var(--color-on-surface-variant);
    margin: 0;
  }
</style>
