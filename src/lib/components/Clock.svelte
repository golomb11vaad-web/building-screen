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
    font: var(--text-display-md);
    color: var(--color-on-surface);
    margin: 0;
  }

  .clock-date {
    font: var(--text-body-md);
    color: var(--color-on-surface-variant);
    margin: var(--space-stack-sm) 0 0;
  }
</style>
