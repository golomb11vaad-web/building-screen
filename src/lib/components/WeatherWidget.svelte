<script lang="ts">
  import type { WeatherData } from '$lib/types';
  export let weather: WeatherData | null;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function visualFor(weatherCode: number): 'sun' | 'cloud' | 'rain' | 'storm' {
    if ([95, 96, 99].includes(weatherCode)) return 'storm';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return 'rain';
    if ([1, 2, 3, 45, 48].includes(weatherCode)) return 'cloud';
    return 'sun';
  }

  function forecastIcon(weatherCode: number): string {
    const visual = visualFor(weatherCode);
    return visual === 'sun' ? '☀️' : visual === 'rain' ? '🌧️' : visual === 'storm' ? '⛈️' : '⛅';
  }

  function weekday(date: string): string {
    return new Intl.DateTimeFormat('he-IL', { weekday: 'short', timeZone: 'Asia/Jerusalem' })
      .format(new Date(`${date}T12:00:00+03:00`));
  }
</script>

<div class="weather-widget">
  {#if weather}
    {@const visual = visualFor(weather.weatherCode)}
    <section class="weather-card weather-card--{visual}" aria-label="מזג האוויר">
      <div class="weather-card__glow"></div>
      <div class="weather-card__topline">
        <span>מזג האוויר</span>
        <span class="weather-card__live"><i></i> עכשיו</span>
      </div>
      <div class="weather-card__hero">
        <div class="weather-icon" aria-hidden="true">
          {#if visual === 'sun'}
            <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="14"/><path d="M40 7v10M40 63v10M7 40h10M63 40h10M16.7 16.7l7.1 7.1M56.2 56.2l7.1 7.1M63.3 16.7l-7.1 7.1M23.8 56.2l-7.1 7.1"/></svg>
          {:else if visual === 'cloud'}
            <svg viewBox="0 0 80 80"><path d="M25 61h31c10 0 17-6.3 17-15 0-8.2-6.1-14.8-14.2-15.6C56.5 22.8 50 18 42.5 18c-9.7 0-17.7 7.6-18.3 17.2C15.5 35.6 9 42.1 9 50c0 6.1 4.8 11 16 11Z"/></svg>
          {:else if visual === 'rain'}
            <svg viewBox="0 0 80 80"><path d="M22 51h35c8.5 0 14-5.3 14-12.5 0-6.7-5.2-12.1-12.1-12.5C56.7 19.5 51 16 44.5 16 36 16 29.1 22.6 28.6 31.1 18.3 30.7 11 37.4 11 45c0 3.8 2 6 11 6Z"/><path d="M27 60l-3 9M43 60l-3 9M59 60l-3 9"/></svg>
          {:else}
            <svg viewBox="0 0 80 80"><path d="M22 49h35c8.5 0 14-5.3 14-12.5 0-6.7-5.2-12.1-12.1-12.5C56.7 17.5 51 14 44.5 14 36 14 29.1 20.6 28.6 29.1 18.3 28.7 11 35.4 11 43c0 3.8 2 6 11 6Z"/><path d="m42 54-8 13h9l-4 10 11-15h-9l5-8"/></svg>
          {/if}
        </div>
        <div>
          <p class="weather-temp" dir="ltr">{weather.temperatureCurrent}°</p>
          <p class="weather-condition">{weather.conditionLabel}</p>
        </div>
      </div>
      <div class="weather-card__footer">
        <p class="weather-range"><strong>{weather.temperatureMax}°</strong> גבוה <span></span> <strong>{weather.temperatureMin}°</strong> נמוך</p>
        <p class="weather-updated">עודכן ב־{formatTime(weather.fetchedAt)}</p>
      </div>
			{#if weather.forecast?.length}
				<div class="weather-forecast" aria-label="תחזית לארבעת הימים הקרובים">
					{#each weather.forecast as day (day.date)}
						<div class="weather-forecast__day">
							<span>{weekday(day.date)}</span>
							<span class="weather-forecast__icon" aria-hidden="true">{forecastIcon(day.weatherCode)}</span>
							<strong dir="ltr">{day.temperatureMax}°</strong>
							<small dir="ltr">{day.temperatureMin}°</small>
						</div>
					{/each}
				</div>
			{/if}
    </section>
  {:else}
    <p class="weather-placeholder">מזג האוויר אינו זמין</p>
  {/if}
</div>

<style>
  .weather-widget {
    padding: 0;
  }

  .weather-card {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    color: #fff;
    padding: clamp(14px, 1.7vh, 20px);
    border-radius: 24px;
    box-shadow: 0 14px 34px rgba(17, 75, 96, 0.25);
    background: linear-gradient(135deg, #15546a, #2b8790);
  }

  .weather-card--cloud { background: linear-gradient(135deg, #416d87, #89a8b8); }
  .weather-card--rain { background: linear-gradient(135deg, #294f71, #517b9c); }
  .weather-card--storm { background: linear-gradient(135deg, #273c63, #6d6796); }

  .weather-card__glow {
    position: absolute;
    z-index: -1;
    width: 190px;
    height: 190px;
    left: -72px;
    bottom: -100px;
    border-radius: 50%;
    background: rgba(255, 214, 125, 0.35);
    filter: blur(4px);
  }

  .weather-card__topline,
  .weather-card__hero,
  .weather-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .weather-card__topline {
    font: var(--text-label-caps);
    letter-spacing: 0.03em;
  }

  .weather-card__live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82em;
    opacity: 0.82;
  }

  .weather-card__live i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #bdf0cd;
    box-shadow: 0 0 0 4px rgba(189, 240, 205, 0.14);
  }

  .weather-card__hero {
    margin-block: clamp(8px, 1.2vh, 14px);
    align-items: flex-end;
  }

  .weather-icon {
    width: clamp(50px, 4vw, 64px);
    height: clamp(50px, 4vw, 64px);
    color: #ffdc83;
  }

  .weather-icon svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .weather-temp {
    font: 300 clamp(50px, 4.3vw, 68px)/0.9 'Heebo', sans-serif;
    color: #fff;
    margin: 0;
    letter-spacing: -0.06em;
  }

  .weather-condition {
    font: 500 clamp(18px, 1.55vw, 24px)/1.2 'Heebo', sans-serif;
    margin: 8px 0 0;
    color: rgba(255, 255, 255, 0.85);
  }

  .weather-card__footer {
    border-top: 1px solid rgba(255, 255, 255, 0.24);
    padding-top: 9px;
    gap: 8px;
  }

  .weather-range {
    font: 400 clamp(14px, 1.1vw, 17px)/1.3 'Heebo', sans-serif;
    color: rgba(255, 255, 255, 0.92);
    margin: 0;
    white-space: nowrap;
  }

  .weather-range strong {
    font-weight: 700;
  }

  .weather-range span {
    display: inline-block;
    width: 4px;
    height: 4px;
    margin: 0 4px 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.65);
  }

  .weather-updated {
    font: 500 clamp(11px, 0.85vw, 13px)/1.2 'Heebo', sans-serif;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    white-space: nowrap;
  }

  .weather-forecast {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-top: 10px;
    padding-top: 9px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .weather-forecast__day {
    display: grid;
    justify-items: center;
    gap: 2px;
    font: 500 clamp(11px, 0.9vw, 14px)/1.05 'Heebo', sans-serif;
    color: rgba(255, 255, 255, 0.9);
  }

  .weather-forecast__icon { font-size: clamp(16px, 1.25vw, 21px); }
  .weather-forecast__day strong { color: #fff; }
  .weather-forecast__day small { color: rgba(255, 255, 255, 0.7); }

  .weather-placeholder {
    font: var(--text-headline-md);
    color: var(--color-on-surface-variant);
    margin: 0;
  }
</style>
