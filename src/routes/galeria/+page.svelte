<script lang="ts">
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { gallery } from '$lib/data/gallery';
	import { pages } from '$lib/data/seo';
</script>

<Seo
	title={pages.gallery.title}
	description={pages.gallery.description}
	keywords={pages.gallery.keywords}
/>

<PageHero
	kicker="Galéria"
	title="Momenty z vystúpení"
	lede="Svadby, plesy, zábavy a festivaly — naskladané ako plagáty na stene skúšobne."
/>

<section class="mx-auto max-w-[90rem] px-4 py-16 md:px-7 md:py-20">
	<GalleryGrid items={gallery} />
</section>
