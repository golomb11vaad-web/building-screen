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
    padding: 0;
    flex: 1;
    overflow: hidden;
  }

  .news-heading {
    font: var(--text-label-caps);
    color: var(--color-primary-container);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 var(--space-stack-md);
  }

  .news-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-stack-md);
  }

  .news-item {
    border-bottom: 1px solid var(--color-outline-variant);
    padding-bottom: var(--space-stack-md);
    line-height: 1.4;
  }

  .news-source {
    display: block;
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
    margin-bottom: var(--space-stack-sm);
  }

  .news-title {
    font: var(--text-body-lg);
    color: var(--color-on-surface);
  }

  .news-placeholder {
    font: var(--text-body-lg);
    color: var(--color-on-surface-variant);
    margin: 0;
  }
</style>
