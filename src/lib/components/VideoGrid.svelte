<script lang="ts">
	import { videos } from '$lib/data/videos';

	let { featured = false }: { featured?: boolean } = $props();
	let playing = $state<string | null>(null);
	let list = $derived(featured ? videos.slice(0, 3) : videos);

	function play(id: string) {
		playing = id;
	}
</script>

<div
	class="grid gap-4 sm:gap-6 md:grid-cols-2 {featured ? 'lg:grid-cols-3' : ''}"
	data-in-stagger
>
	{#each list as video, i (video.id)}
		<article
			class="border-2 border-ink bg-cream text-ink shadow-[4px_4px_0_var(--color-punch)] sm:shadow-[6px_6px_0_var(--color-punch)] {i %
				2 ===
			1
				? 'md:translate-y-6'
				: ''}"
		>
			{#if playing === video.id}
				<div class="aspect-video bg-ink">
					<iframe
						class="h-full w-full"
						src="https://www.youtube-nocookie.com/embed/{video.id}?autoplay=1&playsinline=1"
						title={video.title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
						loading="lazy"
						referrerpolicy="strict-origin-when-cross-origin"
					></iframe>
				</div>
			{:else}
				<button
					type="button"
					class="group relative block w-full touch-manipulation"
					onclick={() => play(video.id)}
					aria-label="Prehrať {video.title}"
				>
					<img
						src="https://i.ytimg.com/vi/{video.id}/hqdefault.jpg"
						srcset="https://i.ytimg.com/vi/{video.id}/mqdefault.jpg 320w, https://i.ytimg.com/vi/{video.id}/hqdefault.jpg 480w, https://i.ytimg.com/vi/{video.id}/sddefault.jpg 640w"
						sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
						alt="Náhľad videa {video.title}"
						width="480"
						height="360"
						loading="lazy"
						decoding="async"
						class="aspect-video w-full object-cover"
					/>
					<span
						class="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center bg-paprika font-display text-xl text-foam shadow-[3px_3px_0_var(--color-ledge)] transition group-hover:scale-110 sm:h-16 sm:w-16 sm:text-2xl sm:shadow-[4px_4px_0_var(--color-punch)]"
						aria-hidden="true"
					>
						▶
					</span>
				</button>
			{/if}
			<div class="px-3 py-3 sm:px-4 sm:py-4">
				<p class="kicker text-[0.8rem] sm:text-[0.95rem]">{video.caption}</p>
				<h3 class="display mt-1 text-[1.65rem] leading-[0.9] sm:text-3xl">{video.title}</h3>
			</div>
		</article>
	{/each}
</div>
