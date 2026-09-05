<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import RotatingBoard from '$lib/components/RotatingBoard.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
	import MarketRail from '$lib/components/MarketRail.svelte';
  import NewsTicker from '$lib/components/NewsTicker.svelte';
  import AmbientBackdrop from '$lib/components/AmbientBackdrop.svelte';
  import { DEFAULT_BACKGROUND_MUSIC } from '$lib/ambientBackgrounds';
  import type { PageData } from './$types';

  export let data: PageData;
  $: backgroundMusic = data.backgroundMusic ?? DEFAULT_BACKGROUND_MUSIC;

  const REFRESH_MS = 60 * 60 * 1000;
  const refreshTimer = setInterval(() => { invalidateAll(); }, REFRESH_MS);
  let backgroundAudio: HTMLAudioElement;
  let audioBlocked = false;

  async function startBackgroundAudio() {
    const playback = backgroundAudio?.play();
    try {
      await playback;
      audioBlocked = false;
    } catch {
      // Browsers require a first interaction before unmuted audio can begin.
      audioBlocked = true;
    }
  }

  onMount(() => {
    startBackgroundAudio();
    document.addEventListener('pointerdown', startBackgroundAudio, { once: true });
    return () => document.removeEventListener('pointerdown', startBackgroundAudio);
  });

  onDestroy(() => { clearInterval(refreshTimer); });
</script>

<div class="display-wrapper">
	<audio bind:this={backgroundAudio} src={backgroundMusic.src} loop autoplay playsinline preload="auto"></audio>
	{#if audioBlocked}
		<button class="audio-start" type="button" on:click={startBackgroundAudio}>הפעל מוזיקה</button>
	{/if}
	<AmbientBackdrop backgrounds={data.backgrounds} />
  <div class="display-layout">
    <Sidebar
      weather={data.weather}
      hebrewDate={data.hebrewDate}
      buildingName={data.buildingName}
      buildingPhones={data.buildingPhones}
			buildingPhoto={data.buildingPhoto}
    />
    <main class="display-main">
      <section class="announcement-panel" aria-label="הודעות הבניין">
        <RotatingBoard messages={data.rotation} />
      </section>
    </main>
		<MarketRail finance={data.finance} news={data.marketNews} />
  </div>
  <NewsTicker items={data.news} />
</div>

<style>
  .display-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
		position: relative;
		isolation: isolate;
    background: transparent;
    overflow: hidden;
  }
  .display-layout {
    display: flex;
    flex: 1;
    min-height: 0;
		position: relative;
		z-index: 1;
		padding: var(--space-gutter);
		gap: var(--space-gutter);
    overflow: hidden;
  }
  .display-main {
    flex: 1;
    min-width: 0;
    min-height: 0;
		display: flex;
		align-items: center;
    justify-content: center;
  }
  .announcement-panel {
    width: 100%;
    height: 100%;
    min-height: 0;
  }
  .announcement-panel :global(.rotating-board) {
    padding: 0;
  }
  .announcement-panel :global(.message-card) {
    width: 100%;
    height: 100%;
    border-radius: 28px;
  }
  .announcement-panel :global(.message-card__text) {
    font-size: var(--message-font-size);
    line-height: 1.2;
    max-width: min(88%, 1000px);
  }
  :global(.news-ticker) {
    position: relative;
    z-index: 1;
  }
  .audio-start {
    position: absolute;
    z-index: 3;
    inset-block-start: 18px;
    inset-inline-start: 18px;
    border: 0;
    border-radius: 999px;
    padding: 10px 16px;
    background: rgba(20, 54, 69, 0.9);
    color: #fff;
    font: 500 16px/1 'Heebo', sans-serif;
    cursor: pointer;
    box-shadow: var(--shadow-soft);
  }
</style>
