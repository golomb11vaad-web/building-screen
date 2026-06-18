<script lang="ts">
  import type { HebrewDateData } from '$lib/types';
  export let hebrewDate: HebrewDateData | null;
</script>

<div class="hebrew-date">
  {#if hebrewDate}
    <p class="hebrew-date-text">{hebrewDate.hebrew}</p>
    {#if hebrewDate.parasha}
      <p class="hebrew-date-parasha">{hebrewDate.parasha}</p>
    {/if}
  {/if}
</div>

<style>
  .hebrew-date {
    text-align: center;
    padding: 0;
  }

  .hebrew-date-text {
    font: var(--text-body-md);
    color: var(--color-on-surface);
    margin: 0;
  }

  .hebrew-date-parasha {
    font: var(--text-body-md);
    color: var(--color-primary);
    margin: var(--space-stack-sm) 0 0;
  }
</style>
