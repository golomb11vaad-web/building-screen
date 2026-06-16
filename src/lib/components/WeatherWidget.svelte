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
    <p class="weather-temp">{weather.temperatureCurrent}°</p>
    <p class="weather-condition">{weather.conditionLabel}</p>
    <p class="weather-range">
      גבוה {weather.temperatureMax}° / נמוך {weather.temperatureMin}°
    </p>
    <p class="weather-updated">עודכן {formatTime(weather.fetchedAt)}</p>
  {:else}
    <p class="weather-placeholder">מזג האוויר אינו זמין</p>
  {/if}
</div>

<style>
  .weather-widget {
    padding: var(--space-sm);
    border-bottom: 1px solid var(--color-border);
  }

  .weather-temp {
    font-size: 2.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .weather-condition,
  .weather-range,
  .weather-updated,
  .weather-placeholder {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: var(--space-xs) 0 0;
  }
</style>
