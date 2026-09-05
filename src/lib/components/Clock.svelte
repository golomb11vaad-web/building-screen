<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let time = '';
  let dateStr = '';
  let timer: ReturnType<typeof setInterval> | null = null;

  function update() {
    const now = new Date();
    time = now.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    dateStr = now.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onMount(() => {
    update();
    timer = setInterval(update, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<div class="clock">
  <p class="clock-time">{time}</p>
  <p class="clock-date">{dateStr}</p>
</div>

<style>
  .clock {
    text-align: center;
    padding: 0;
  }

  .clock-time {
    font: 400 clamp(44px, 4.1vw, 64px)/1 'Heebo', sans-serif;
    color: var(--color-on-surface);
    margin: 0;
  }

  .clock-date {
    font: 400 clamp(16px, 1.35vw, 20px)/1.35 'Heebo', sans-serif;
    color: var(--color-on-surface-variant);
    margin: clamp(4px, 0.7vh, 10px) 0 0;
  }
</style>
