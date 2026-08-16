<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import ScrollTop from '$lib/components/ScrollTop.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { faqLd, seo } from '$lib/data/seo';
	import { site } from '$lib/data/site';
	import { afterPaint, prefersLightMotion } from '$lib/motion-prefs';
	import { hydrateTheme } from '$lib/theme.svelte';

	let { children } = $props();
	let shellEl = $state<HTMLElement>();

	$effect(() => {
		hydrateTheme();
	});

	afterNavigate((navigation) => {
		if (navigation.to?.url.hash) return;
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	});

	/** Light punch hovers only — after paint, desktop/fine pointer. */
	$effect(() => {
		void page.url.pathname;
		if (!shellEl) return;
		if (prefersLightMotion()) return;

		let cancelled = false;
		const cleanups: Array<() => void> = [];

		const cancelIdle = afterPaint(() => {
			void import('$lib/motion').then((m) => {
				if (cancelled) return;
				cleanups.push(m.bindPunches(document.body));
			});
		});

		return () => {
			cancelled = true;
			cancelIdle();
			cleanups.forEach((fn) => fn());
		};
	});

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				...seo.organization,
				'@id': `${site.url}/#band`
			},
			{
				'@type': 'WebSite',
				'@id': `${site.url}/#website`,
				url: site.url,
				name: site.name,
				description: site.description,
				inLanguage: 'sk-SK',
				publisher: { '@id': `${site.url}/#band` },
				keywords: seo.keywords
			},
			{
				'@type': 'WebPage',
				'@id': `${site.url}${page.url.pathname}#webpage`,
				url: `${site.url}${page.url.pathname}`,
				isPartOf: { '@id': `${site.url}/#website` },
				about: { '@id': `${site.url}/#band` },
				inLanguage: 'sk-SK'
			}
		]
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/images/logo.webp" />
	<meta name="theme-color" content="#f3ead8" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#100e0c" media="(prefers-color-scheme: dark)" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{#if page.url.pathname === '/'}
		{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`}
	{/if}
</svelte:head>

<Preloader />
<Header />
<div bind:this={shellEl}>
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<ScrollTop />
<a
	href="tel:{site.phone}"
	class="btn-hot fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[100] md:hidden"
>
	<Icon name="phone" size={16} /> Volajte
</a>
