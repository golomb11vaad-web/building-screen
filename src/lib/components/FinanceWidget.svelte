<script lang="ts">
  import type { FinanceItem } from '$lib/types';
  export let items: FinanceItem[];

  function changeClass(change: string): string {
    if (change.startsWith('+') && change !== '+0.00') return 'change-up';
    if (change.startsWith('-')) return 'change-down';
    return 'change-neutral';
  }

  function changeSymbol(change: string): string {
    if (change.startsWith('+') && change !== '+0.00') return '▲';
    if (change.startsWith('-')) return '▼';
    return '';
  }
</script>

<div class="finance-widget">
  {#if items.length > 0}
    {#each items as item}
      <div class="finance-item">
        <span class="finance-label">{item.label}</span>
        <span class="finance-value">{item.value}</span>
        <span class="finance-change {changeClass(item.change)}">
          {changeSymbol(item.change)} {item.change}
        </span>
      </div>
    {/each}
  {/if}
</div>

<style>
  .finance-widget {
    display: flex;
    flex-direction: column;
    gap: var(--space-stack-sm);
    padding: 0;
  }

  .finance-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-stack-sm);
  }

  .finance-label {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
  }

  .finance-value {
    font: var(--text-body-md);
    color: var(--color-on-surface);
  }

  .finance-change {
    font: var(--text-label-caps);
    letter-spacing: 0.05em;
  }

  .change-up {
    color: var(--color-positive);
  }

  .change-down {
    color: var(--color-negative);
  }

  .change-neutral {
    color: var(--color-on-surface-variant);
  }
</style>
