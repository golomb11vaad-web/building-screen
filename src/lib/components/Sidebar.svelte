<script lang="ts">
  import type { AmbientBackground, WeatherData, HebrewDateData } from '$lib/types';
  import Clock from './Clock.svelte';
  import HebrewDate from './HebrewDate.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import BuildingInfo from './BuildingInfo.svelte';
  export let weather: WeatherData | null;
  export let hebrewDate: HebrewDateData | null = null;
  export let buildingName: string = '';
  export let buildingPhones: string[] = [];
  export let buildingPhoto: AmbientBackground | null = null;
</script>

<aside class="sidebar">
  <Clock />
  {#if hebrewDate}
    <HebrewDate {hebrewDate} />
  {/if}
  <WeatherWidget {weather} />
  {#if buildingName || buildingPhones.length > 0}
    <BuildingInfo {buildingName} phones={buildingPhones} />
  {/if}
  {#if buildingPhoto}
    <figure class="building-photo">
      <img src={buildingPhoto.src} alt={buildingPhoto.label} />
      <figcaption>{buildingPhoto.label}</figcaption>
    </figure>
  {/if}
</aside>

<style>
  .sidebar {
    width: clamp(17rem, 20vw, 22rem);
    flex: 0 0 clamp(17rem, 20vw, 22rem);
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--color-surface-container);
		backdrop-filter: var(--blur-surface);
		-webkit-backdrop-filter: var(--blur-surface);
    border: 1px solid rgba(255, 255, 255, 0.62);
		border-radius: 28px;
    padding: 18px clamp(24px, 2.6vw, 40px);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
  }

  /* Keep the forecast visually separate from the building contact details. */
  .sidebar :global(.weather-widget) {
    margin-bottom: clamp(8px, 1.2vh, 16px);
  }

  @media (max-height: 900px) {
    .sidebar {
      padding-block: 14px;
      gap: 7px;
    }
  }

  .building-photo {
    position: relative;
    overflow: hidden;
    height: clamp(112px, 15vh, 145px);
    min-height: 112px;
    margin: auto 0 0;
    border-radius: 16px;
    background: linear-gradient(135deg, #dcefeb, #afc9c4);
  }

  .building-photo::after {
    content: '';
    position: absolute;
    inset: 45% 0 0;
    background: linear-gradient(transparent, rgba(8, 36, 47, 0.7));
  }

  .building-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 42%;
    display: block;
  }

  .building-photo figcaption {
    position: absolute;
    z-index: 1;
    bottom: 8px;
    inset-inline: 12px;
    color: #fff;
    font: var(--text-label-caps);
  }
</style>
