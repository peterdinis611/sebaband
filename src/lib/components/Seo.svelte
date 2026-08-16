<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';
	import { seo } from '$lib/data/seo';

	let {
		title,
		description,
		keywords,
		noindex = false,
		ogType = 'website',
		image = seo.ogImage,
		imageAlt = seo.ogImageAlt
	}: {
		title: string;
		description?: string;
		keywords?: string;
		noindex?: boolean;
		ogType?: string;
		image?: string;
		imageAlt?: string;
	} = $props();

	const desc = $derived((description ?? site.description).trim());
	const keys = $derived(keywords ?? seo.keywords);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const absoluteImage = $derived(
		image.startsWith('http') ? image : new URL(image, site.url).href
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	<meta name="keywords" content={keys} />
	<meta name="author" content={site.name} />
	<meta name="creator" content={site.name} />
	<meta name="publisher" content={site.name} />
	<meta name="application-name" content={site.name} />
	<meta name="category" content="music,entertainment,wedding" />
	<meta name="geo.region" content="SK" />
	<meta name="geo.placename" content="Slovensko" />
	<meta name="language" content="sk" />
	<meta http-equiv="content-language" content="sk" />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang="sk" href={canonical} />
	<link rel="alternate" hreflang="sk-SK" href={canonical} />
	<link rel="alternate" hreflang="x-default" href={canonical} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
		<meta name="googlebot" content="noindex, nofollow" />
	{:else}
		<meta
			name="robots"
			content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
		/>
		<meta name="googlebot" content="index, follow" />
	{/if}

	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={seo.locale} />
	{#each seo.localeAlt as loc (loc)}
		<meta property="og:locale:alternate" content={loc} />
	{/each}
	<meta property="og:type" content={ogType} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:image:width" content="1400" />
	<meta property="og:image:height" content="1050" />

	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={absoluteImage} />
	<meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
