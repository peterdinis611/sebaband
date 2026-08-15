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
	import { faqLd, seo } from '$lib/data/seo';
	import { site } from '$lib/data/site';
	import { bindParallax, bindPunches, bindScrollIns } from '$lib/motion';
	import { hydrateTheme } from '$lib/theme.svelte';

	let { children } = $props();
	let shellEl = $state<HTMLElement>();

	const isPreview = $derived(page.url.searchParams.get('preview') === '1');
	const isAnalytics = $derived(page.url.pathname.startsWith('/analytics'));

	$effect(() => {
		hydrateTheme();
	});

	$effect(() => {
		document.documentElement.classList.toggle('heat-preview', isPreview);
		document.documentElement.classList.toggle('is-analytics', isAnalytics);
		return () => {
			document.documentElement.classList.remove('heat-preview');
			document.documentElement.classList.remove('is-analytics');
		};
	});

	$effect(() => {
		if (!isAnalytics && !isPreview) return;
		document.getElementById('boot')?.remove();
		document.documentElement.classList.remove('is-booting');
		document.documentElement.classList.add('boot-skip');
	});

	afterNavigate((navigation) => {
		const path = navigation.to?.url.pathname;
		const preview = navigation.to?.url.searchParams.get('preview') === '1';
		if (path && !preview) trackHit(path);
		if (navigation.to?.url.hash) return;
		if (!preview) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	});

	$effect(() => {
		if (isPreview || isAnalytics) return;
		return bindClickTracking(() => page.url.pathname);
	});

	$effect(() => {
		void page.url.pathname;
		if (!shellEl || isPreview) return;

		// Analytics: force-visible, no motion (data-in starts at opacity 0)
		if (isAnalytics) {
			for (const el of shellEl.querySelectorAll<HTMLElement>(
				'[data-in], [data-in-stagger] > *, .js-gallery > *'
			)) {
				el.style.opacity = '1';
				el.style.transform = 'none';
				el.style.filter = 'none';
			}
			return;
		}

		const stopScroll = bindScrollIns(shellEl);
		const stopParallax = bindParallax(shellEl);
		const stopPunch = bindPunches(document.body);
		return () => {
			stopScroll();
			stopParallax();
			stopPunch();
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
	{#if isPreview}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
		{#if page.url.pathname === '/'}
			{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`}
		{/if}
	{/if}
</svelte:head>

{#if isPreview}
	<div class="heat-preview-shell" bind:this={shellEl}>
		<main>
			{@render children()}
		</main>
	</div>
{:else}
	<div class="grain" aria-hidden="true"></div>
	{#if !isAnalytics}
		<Preloader />
		<PageCurtain />
	{/if}

	<div class="theme-wipe" aria-hidden="true"></div>
	<Header />
	<div class:analytics-shell={isAnalytics} bind:this={shellEl}>
		<main>
			{@render children()}
		</main>
		<Footer />
	</div>

	{#if !isAnalytics}
		<ScrollTop />
		<a
			href="tel:{site.phone}"
			class="btn-hot fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[100] md:hidden"
		>
			<Icon name="phone" size={16} /> Volajte
		</a>
	{/if}
{/if}

<style>
	:global(html.heat-preview) {
		scroll-behavior: auto;
	}

	:global(html.heat-preview body) {
		cursor: default !important;
	}

	:global(html.heat-preview *) {
		animation: none !important;
		transition: none !important;
		scroll-behavior: auto !important;
	}

	:global(html.heat-preview .grain),
	:global(html.heat-preview video),
	:global(html.heat-preview .page-curtain),
	:global(html.heat-preview .nav-progress) {
		display: none !important;
	}

	:global(html.heat-preview img) {
		content-visibility: auto;
		contain-intrinsic-size: 320px 200px;
	}

	.heat-preview-shell :global(header),
	.heat-preview-shell :global(footer),
	.heat-preview-shell :global(.scroll-top),
	.heat-preview-shell :global(.btn-hot.fixed) {
		display: none !important;
	}

	.heat-preview-shell :global(main) {
		padding-top: 0;
	}

	.heat-preview-shell :global(section.pt-28),
	.heat-preview-shell :global(section.pt-24) {
		padding-top: 1.25rem !important;
	}

	.heat-preview-shell :global(main > section:nth-child(n + 3)) {
		display: none !important;
	}

	/* Hard guarantee: analytics content is never stuck at opacity 0 */
	:global(html.is-analytics [data-in]),
	:global(html.is-analytics [data-in-stagger] > *),
	:global(html.is-analytics .js-gallery > *),
	.analytics-shell :global([data-in]),
	.analytics-shell :global([data-in-stagger] > *),
	.analytics-shell :global(.js-gallery > *) {
		opacity: 1 !important;
		transform: none !important;
		filter: none !important;
	}
</style>
