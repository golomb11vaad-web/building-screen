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
    font: 400 clamp(16px, 1.3vw, 20px)/1.25 'Heebo', sans-serif;
    color: var(--color-on-surface);
    margin: 0;
  }

  .hebrew-date-parasha {
    font: 500 clamp(16px, 1.3vw, 20px)/1.25 'Heebo', sans-serif;
    color: var(--color-primary);
    margin: clamp(4px, 0.7vh, 10px) 0 0;
  }
</style>
