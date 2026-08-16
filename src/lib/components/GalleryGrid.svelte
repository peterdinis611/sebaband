<script lang="ts">
	import Lightbox from '$lib/components/Lightbox.svelte';
	import SmartImage from '$lib/components/SmartImage.svelte';
	import { afterPaint } from '$lib/motion-prefs';
	import type { GalleryItem } from '$lib/data/gallery';

	let { items, limit }: { items: GalleryItem[]; limit?: number } = $props();

	let visible = $derived(limit ? items.slice(0, limit) : items);
	let index = $state(0);
	let open = $state(false);
	let grid = $state<HTMLElement>();

	$effect(() => {
		void visible;
		if (!grid) return;
		return afterPaint(() => {
			void import('$lib/motion').then((m) => {
				if (grid) m.playGallery(grid);
			});
		});
	});

	const spanClass: Record<GalleryItem['span'], string> = {
		hero: 'col-span-2 min-h-[11rem] sm:min-h-[13rem] md:col-span-7 md:row-span-2 md:min-h-[20rem] md:-rotate-2',
		wide: 'col-span-2 min-h-[10rem] sm:min-h-[12rem] md:col-span-5 md:min-h-[15rem] md:rotate-2',
		tall: 'col-span-1 min-h-[14rem] sm:min-h-[16rem] md:col-span-4 md:row-span-2 md:min-h-[20rem] md:-rotate-1',
		square: 'col-span-1 min-h-[10rem] sm:min-h-[12rem] md:col-span-4 md:min-h-[14rem] md:rotate-1'
	};

	function show(item: GalleryItem) {
		const found = visible.findIndex((entry) => entry.src === item.src);
		index = found < 0 ? 0 : found;
		open = true;
	}

	function sizesFor(span: GalleryItem['span']) {
		if (span === 'hero' || span === 'wide') {
			return '(min-width: 768px) 58vw, 100vw';
		}
		return '(min-width: 768px) 33vw, 50vw';
	}
</script>

<div
	bind:this={grid}
	class="js-gallery grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-12 md:gap-6"
>
	{#each visible as item, i (item.src)}
		<button
			type="button"
			class="group relative overflow-hidden border-2 border-ink bg-cream p-1.5 shadow-[4px_4px_0_var(--color-punch)] touch-manipulation sm:p-2 md:shadow-[6px_6px_0_var(--color-punch)] {spanClass[
				item.span
			]}"
			style="z-index: {i + 1}; content-visibility: auto; contain-intrinsic-size: 240px"
			onclick={() => show(item)}
		>
			<SmartImage
				src={item.src}
				alt={item.alt}
				width={item.width}
				height={item.height}
				sizes={sizesFor(item.span)}
				class="absolute inset-1.5 overflow-hidden sm:inset-2"
				imgClass="h-full w-full object-cover contrast-[1.05] saturate-[1.05] transition duration-500 group-hover:scale-105"
			/>
			<span
				class="font-display absolute bottom-2 left-2 bg-paprika px-1.5 py-0.5 text-[0.65rem] font-extrabold uppercase text-foam opacity-90 transition sm:bottom-3 sm:left-3 sm:px-2 sm:py-1 sm:text-sm sm:opacity-0 sm:group-hover:opacity-100"
			>
				Zväčšiť
			</span>
		</button>
	{/each}
</div>

<Lightbox items={visible} bind:index bind:open />
