<script lang="ts">
	import type { AmbientBackground } from '$lib/types';
	export let backgrounds: AmbientBackground[];
</script>

<div class="ambient-backdrop" aria-hidden="true">
	{#each backgrounds as background, index (background.id)}
		<div
			class="ambient-backdrop__image"
			style={`background-image: url('${background.src}'); animation-delay: ${index * 12}s`}
		></div>
	{/each}
	<div class="ambient-backdrop__wash"></div>
</div>

<style>
	.ambient-backdrop {
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: #dce8e7;
		z-index: 0;
		pointer-events: none;
	}

	.ambient-backdrop__image,
	.ambient-backdrop__wash {
		position: absolute;
		inset: -2%;
	}

	.ambient-backdrop__image {
		background-position: center;
		background-size: cover;
		opacity: 0;
		animation: ambient-crossfade 36s ease-in-out infinite;
		transform: scale(1.04);
	}

	.ambient-backdrop__wash {
		background:
			linear-gradient(110deg, rgba(239, 249, 247, 0.28), rgba(239, 249, 247, 0.04) 55%, rgba(20, 54, 69, 0.14)),
			linear-gradient(to bottom, rgba(16, 39, 49, 0.04), rgba(16, 39, 49, 0.18));
		z-index: 1;
	}

	@keyframes ambient-crossfade {
		0%, 5% { opacity: 0.62; transform: scale(1.04); }
		11%, 30% { opacity: 1; }
		36%, 100% { opacity: 0; transform: scale(1.09); }
	}

	@media (prefers-reduced-motion: reduce) {
		.ambient-backdrop__image { animation: none; }
		.ambient-backdrop__image:first-child { opacity: 1; }
	}
</style>
