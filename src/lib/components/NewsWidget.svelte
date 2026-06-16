<script lang="ts">
  import type { NewsItem } from '$lib/types';
  export let items: NewsItem[];

  function sourceLabel(source: NewsItem['source']): string {
    return source === 'Ynet' ? 'ynet' : 'כלכליסט';
  }
</script>

<div class="news-widget">
  <h2 class="news-heading">חדשות</h2>
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
    padding: var(--space-sm);
    flex: 1;
    overflow-y: auto;
  }

  .news-heading {
    font-size: 1rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--space-xs);
  }

  .news-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .news-item {
    margin-bottom: var(--space-sm);
    line-height: 1.4;
  }

  .news-source {
    display: block;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-bottom: 0.2rem;
  }

  .news-title {
    font-size: 1rem;
    color: var(--color-text);
  }

  .news-placeholder {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0;
  }
</style>
