<script lang="ts">
  import type { WeatherData } from '$lib/types';
  export let weather: WeatherData | null;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="weather-widget">
  {#if weather}
    <div class="weather-main">
      <p class="weather-temp">{weather.temperatureCurrent}°</p>
      <p class="weather-condition">{weather.conditionLabel}</p>
    </div>
    <div class="weather-details">
      <p class="weather-range">
        גבוה {weather.temperatureMax}° / נמוך {weather.temperatureMin}°
      </p>
      <p class="weather-updated">עודכן {formatTime(weather.fetchedAt)}</p>
    </div>
  {:else}
    <p class="weather-placeholder">מזג האוויר אינו זמין</p>
  {/if}
</div>

<style>
  .weather-widget {
    padding: 0;
  }

  .weather-main {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-stack-md);
  }

  .weather-temp {
    font: var(--text-display-md);
    color: var(--color-on-surface);
    margin: 0;
  }

  .weather-condition {
    font: var(--text-headline-md);
    color: var(--color-primary);
    margin: 0;
  }

  .weather-details {
    margin-top: var(--space-stack-md);
    padding-top: var(--space-stack-md);
    border-top: 1px solid var(--color-outline-variant);
  }

  .weather-range {
    font: var(--text-body-md);
    color: var(--color-on-surface-variant);
    margin: 0;
  }

  .weather-updated {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    opacity: 0.6;
    letter-spacing: 0.05em;
    margin: var(--space-stack-sm) 0 0;
  }

  .weather-placeholder {
    font: var(--text-headline-md);
    color: var(--color-on-surface-variant);
    margin: 0;
  }
</style>
