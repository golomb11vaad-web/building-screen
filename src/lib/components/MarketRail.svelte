<script lang="ts">
	import type { FinanceItem, NewsItem } from '$lib/types';
	import FinanceWidget from './FinanceWidget.svelte';
	import NewsWidget from './NewsWidget.svelte';

	export let finance: FinanceItem[] = [];
	export let news: NewsItem[] = [];
</script>

<aside class="market-rail" aria-label="שווקים וכלכלה">
	<div class="market-rail__header">
		<span class="market-rail__eyebrow">נתונים בזמן אמת</span>
		<h2>שווקים וכלכלה</h2>
	</div>
	<FinanceWidget items={finance} />
	<div class="market-rail__divider"></div>
	<NewsWidget items={news} heading="כותרות כלכלה" />
</aside>

<style>
	.market-rail {
		width: clamp(17rem, 19vw, 22rem);
		flex: 0 0 clamp(17rem, 19vw, 22rem);
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(10px, 1.6vh, 22px);
		padding: clamp(20px, 3vh, 36px) clamp(22px, 2.4vw, 34px);
		overflow: hidden;
		background: rgba(13, 50, 64, 0.76);
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 28px;
		box-shadow: 0 20px 60px rgba(11, 39, 49, 0.24);
		backdrop-filter: var(--blur-surface);
		-webkit-backdrop-filter: var(--blur-surface);
	}

	.market-rail__eyebrow {
		display: block;
		font: var(--text-label-caps);
		color: #a8dbd2;
		letter-spacing: 0.06em;
	}

	.market-rail__header h2 {
		font: 500 clamp(28px, 2.35vw, 38px)/1.2 'Heebo', sans-serif;
		margin: 4px 0 0;
	}

	.market-rail__divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.2);
	}

	:global(.market-rail .finance-label),
	:global(.market-rail .finance-change),
	:global(.market-rail .news-source) {
		color: #abd1d3 !important;
	}

	:global(.market-rail .finance-value),
	:global(.market-rail .news-title),
	:global(.market-rail .news-heading) {
		color: #fff !important;
	}

	:global(.market-rail .finance-label),
	:global(.market-rail .finance-change) { font-size: clamp(17px, 1.25vw, 21px); }
	:global(.market-rail .finance-value) { font-size: clamp(21px, 1.55vw, 26px); }
	:global(.market-rail .news-source) { font-size: clamp(16px, 1.15vw, 19px); }
	:global(.market-rail .news-title) { font-size: clamp(19px, 1.45vw, 25px); line-height: 1.25; }

	:global(.market-rail .news-heading) {
		margin-bottom: clamp(6px, 1vh, 14px);
	}

	:global(.market-rail .news-item) {
		border-color: rgba(255, 255, 255, 0.18);
	}

	:global(.market-rail .change-up) { color: #8de3bb !important; }
	:global(.market-rail .change-down) { color: #ffb4ad !important; }

	@media (max-height: 820px) {
		.market-rail { padding-block: 16px; gap: 8px; }
	}
</style>
