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

	const webp = $derived(src.replace(/\.(jpe?g|png)$/i, '.webp'));
</script>

<picture class={className}>
	<source type="image/webp" srcset={webp} {sizes} />
	<img
		{src}
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
