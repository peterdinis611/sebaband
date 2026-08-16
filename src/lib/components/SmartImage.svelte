<script lang="ts">
	import { page } from '$app/state';
	import { isPreviewMode } from '$lib/query';

	let {
		src,
		alt,
		class: className = '',
		imgClass = '',
		width,
		height,
		priority = false,
		sizes = '100vw'
	}: {
		src: string;
		alt: string;
		class?: string;
		imgClass?: string;
		width?: number;
		height?: number;
		priority?: boolean;
		sizes?: string;
	} = $props();

	let lite = $state(false);
	$effect(() => {
		void page.url.pathname;
		lite = isPreviewMode();
	});

	const base = $derived(src.replace(/\.(jpe?g|png|webp|avif)$/i, ''));
	const webpSm = $derived(`${base}-sm.webp`);
	const webpMd = $derived(`${base}-md.webp`);
	const webp = $derived(`${base}.webp`);
	const avifSm = $derived(`${base}-sm.avif`);
	const avifMd = $derived(`${base}-md.avif`);
	const avif = $derived(`${base}.avif`);
	const webpSrcset = $derived(
		lite ? `${webpSm} 720w` : `${webpSm} 720w, ${webpMd} 1100w, ${webp} 1400w`
	);
	const avifSrcset = $derived(
		lite ? `${avifSm} 720w` : `${avifSm} 720w, ${avifMd} 1100w, ${avif} 1400w`
	);
	const resolvedSizes = $derived(lite ? '640px' : sizes);
	const eager = $derived(!lite && priority);
	/** WebP as <img> fallback — avoids shipping JPEG on the hot path */
	const fallbackSrc = $derived(lite ? webpSm : webp);
</script>

<picture class={className}>
	<source type="image/avif" srcset={avifSrcset} sizes={resolvedSizes} />
	<source type="image/webp" srcset={webpSrcset} sizes={resolvedSizes} />
	<img
		src={fallbackSrc}
		{alt}
		{width}
		{height}
		sizes={resolvedSizes}
		class={imgClass}
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={eager ? 'high' : 'auto'}
		decoding="async"
	/>
</picture>
