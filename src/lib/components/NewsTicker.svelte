<script lang="ts">
  import type { NewsItem } from '$lib/types';
  export let items: NewsItem[];
</script>

<div class="news-ticker">
  <span class="ticker-label">חדשות</span>
  {#if items.length > 0}
    <div class="ticker-track">
      <div class="ticker-content">
        {#each items as item, i}
          <span class="ticker-headline">{item.title}</span>
          {#if i < items.length - 1}
            <span class="ticker-separator">&bull;</span>
          {/if}
        {/each}
        <span class="ticker-separator">&bull;</span>
        {#each items as item, i}
          <span class="ticker-headline">{item.title}</span>
          {#if i < items.length - 1}
            <span class="ticker-separator">&bull;</span>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .news-ticker {
    height: 75px;
    display: flex;
    align-items: center;
    background: var(--color-surface-container);
    border-top: 1px solid var(--color-outline-variant);
    padding: 0 var(--space-safe-margin);
    overflow: hidden;
    gap: var(--space-stack-md);
  }

  .ticker-label {
    font: var(--text-label-caps);
    color: var(--color-on-primary);
    background: var(--color-primary);
    padding: 4px 12px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ticker-track {
    flex: 1;
    overflow: hidden;
    direction: rtl;
  }

  .ticker-content {
    display: inline-flex;
    gap: var(--space-stack-md);
    white-space: nowrap;
    animation: ticker-scroll 120s linear infinite;
  }

  .ticker-headline {
    font: var(--text-body-md);
    color: var(--color-on-surface);
  }

  .ticker-separator {
    color: var(--color-on-surface-variant);
  }

  @keyframes ticker-scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
</style>
