<script lang="ts">
	import { page } from '$app/state';

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

	const lite = $derived(page.url.searchParams.get('preview') === '1');
	const base = $derived(src.replace(/\.(jpe?g|png)$/i, ''));
	const webpSm = $derived(`${base}-sm.webp`);
	const webpMd = $derived(`${base}-md.webp`);
	const webp = $derived(`${base}.webp`);
	const srcset = $derived(
		lite ? `${webpSm} 720w` : `${webpSm} 720w, ${webpMd} 1100w, ${webp} 1400w`
	);
	const resolvedSizes = $derived(lite ? '640px' : sizes);
	const eager = $derived(!lite && priority);
</script>

<picture class={className}>
	<source type="image/webp" srcset={srcset} sizes={resolvedSizes} />
	<img
		src={lite ? webpSm : src}
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
