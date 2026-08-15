<script lang="ts">
	import Lightbox from '$lib/components/Lightbox.svelte';
	import SmartImage from '$lib/components/SmartImage.svelte';
	import { playGallery } from '$lib/motion';
	import type { GalleryItem } from '$lib/data/gallery';

	let { items, limit }: { items: GalleryItem[]; limit?: number } = $props();

	let visible = $derived(limit ? items.slice(0, limit) : items);
	let index = $state(0);
	let open = $state(false);
	let grid = $state<HTMLElement>();

	$effect(() => {
		void visible;
		if (!grid) return;
		return playGallery(grid);
	});

	const spanClass: Record<GalleryItem['span'], string> = {
		hero: 'md:col-span-7 md:row-span-2 min-h-[20rem] md:-rotate-2',
		wide: 'md:col-span-5 min-h-[15rem] md:rotate-2',
		tall: 'md:col-span-4 md:row-span-2 min-h-[20rem] md:-rotate-1',
		square: 'md:col-span-4 min-h-[14rem] md:rotate-1'
	};

	function show(item: GalleryItem) {
		const found = visible.findIndex((entry) => entry.src === item.src);
		index = found < 0 ? 0 : found;
		open = true;
	}

	function sizesFor(span: GalleryItem['span']) {
		if (span === 'hero') return '(min-width: 768px) 58vw, 100vw';
		if (span === 'wide') return '(min-width: 768px) 42vw, 100vw';
		return '(min-width: 768px) 33vw, 100vw';
	}
</script>

<div bind:this={grid} class="js-gallery grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
	{#each visible as item, i (item.src)}
		<button
			type="button"
			class="group relative overflow-hidden border-2 border-ink bg-cream p-2 shadow-[6px_6px_0_var(--color-punch)] {spanClass[
				item.span
			]}"
			style="z-index: {i + 1}"
			onclick={() => show(item)}
		>
			<SmartImage
				src={item.src}
				alt={item.alt}
				width={item.width}
				height={item.height}
				sizes={sizesFor(item.span)}
				class="absolute inset-2 overflow-hidden"
				imgClass="h-full w-full object-cover contrast-[1.05] saturate-[1.05] transition duration-500 group-hover:scale-105"
			/>
			<span
				class="font-display absolute bottom-3 left-3 bg-paprika px-2 py-1 text-sm font-extrabold uppercase text-foam opacity-0 transition group-hover:opacity-100"
			>
				Zväčšiť
			</span>
		</button>
	{/each}
</div>

<Lightbox items={visible} bind:index bind:open />
