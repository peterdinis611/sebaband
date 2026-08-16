<script lang="ts">
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

	const base = $derived(src.replace(/\.(jpe?g|png|webp|avif)$/i, ''));
	const webpSm = $derived(`${base}-sm.webp`);
	const webpMd = $derived(`${base}-md.webp`);
	const webp = $derived(`${base}.webp`);
	const avifSm = $derived(`${base}-sm.avif`);
	const avifMd = $derived(`${base}-md.avif`);
	const avif = $derived(`${base}.avif`);
	const webpSrcset = $derived(`${webpSm} 720w, ${webpMd} 1100w, ${webp} 1400w`);
	const avifSrcset = $derived(`${avifSm} 720w, ${avifMd} 1100w, ${avif} 1400w`);
</script>

<picture class={className}>
	<source type="image/avif" srcset={avifSrcset} {sizes} />
	<source type="image/webp" srcset={webpSrcset} {sizes} />
	<img
		src={webp}
		{alt}
		{width}
		{height}
		{sizes}
		class={imgClass}
		loading={priority ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : 'auto'}
		decoding="async"
	/>
</picture>
