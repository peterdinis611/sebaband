<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { pages } from '$lib/data/seo';
	import { site } from '$lib/data/site';
</script>

<Seo title={pages.videos.title} description={pages.videos.description} keywords={pages.videos.keywords} />

<PageHero
	kicker="Videá"
	title="Klipy a nahrávky"
	lede="Kliknutím spustíte prehrávanie priamo tu. Ďalšie kúsky sú na YouTube."
/>

<section class="mx-auto max-w-[90rem] px-4 py-16 md:px-7 md:py-20">
	<VideoGrid />
	<p class="mt-12 text-center font-light text-ink-soft">
		Celý kanál:
		<a class="font-semibold text-paprika" href={site.youtube} rel="noreferrer" target="_blank">YouTube</a>
	</p>
</section>
