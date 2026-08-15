<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import PageCurtain from '$lib/components/PageCurtain.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import ScrollTop from '$lib/components/ScrollTop.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { bindClickTracking, trackHit } from '$lib/analytics.svelte';
	import { site } from '$lib/data/site';
	import { bindPunches, bindScrollIns } from '$lib/motion';
	import { hydrateTheme } from '$lib/theme.svelte';

	let { children } = $props();
	let shellEl = $state<HTMLElement>();

	$effect(() => {
		hydrateTheme();
	});

	afterNavigate((navigation) => {
		const path = navigation.to?.url.pathname;
		if (path) trackHit(path);
		if (navigation.to?.url.hash) return;
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	});

	$effect(() => {
		return bindClickTracking(() => page.url.pathname);
	});

	$effect(() => {
		void page.url.pathname;
		if (!shellEl) return;
		const stopScroll = bindScrollIns(shellEl);
		const stopPunch = bindPunches(document.body);
		return () => {
			stopScroll();
			stopPunch();
		};
	});

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'MusicGroup',
		name: site.name,
		description: site.description,
		foundingDate: String(site.founded),
		genre: 'Live wedding band',
		email: site.email,
		telephone: site.phone,
		areaServed: ['SK', 'EU'],
		sameAs: [site.facebook, site.tiktok, site.youtube]
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:image" content="/images/hero-band.jpg" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="grain" aria-hidden="true"></div>
<Preloader />
<PageCurtain />

<div class="theme-wipe" aria-hidden="true"></div>
<Header />
<div bind:this={shellEl}>
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<ScrollTop />
<a href="tel:{site.phone}" class="btn-hot fixed right-4 bottom-4 z-[100] md:hidden">
	<Icon name="phone" size={16} /> Volajte
</a>
