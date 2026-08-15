<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { pages } from '$lib/data/seo';
	import { site } from '$lib/data/site';
</script>

<Seo
	title={pages.contact.title}
	description={pages.contact.description}
	keywords={pages.contact.keywords}
/>

<PageHero
	kicker="Kontakt"
	title="Sme na linke"
	lede="Zavolajte alebo napíšte. Termín a dopyt nájdete v rezerváciách."
/>

<section class="mx-auto max-w-[90rem] px-4 py-16 md:px-7 md:py-20">
	<div class="mx-auto grid max-w-3xl gap-4" data-in-stagger>
		<a class="contact-card contact-card-hot" href="tel:{site.phone}">
			<span class="icon-mark"><Icon name="phone" /></span>
			<span>
				<span class="kicker">Telefón</span>
				<span class="display mt-1 block text-2xl tracking-tight sm:text-3xl md:text-4xl"
					>{site.phoneDisplay}</span
				>
			</span>
		</a>
		<a class="contact-card" href="mailto:{site.email}">
			<span class="icon-mark icon-mark-ink"><Icon name="mail" /></span>
			<span>
				<span class="kicker">E-mail</span>
				<span class="mt-1 block break-all text-lg">{site.email}</span>
			</span>
		</a>
		<div class="contact-card contact-card-pine">
			<span class="icon-mark icon-mark-foam"><Icon name="pin" /></span>
			<span>
				<span class="kicker">Pôsobíme</span>
				<span class="display mt-1 block text-2xl text-foam sm:text-3xl md:text-4xl"
					>{site.region}</span
				>
			</span>
		</div>
		<div class="flex flex-wrap gap-2 pt-2">
			<a class="btn-ink !px-3 !py-2 !text-sm sm:!px-6 sm:!text-base" href={site.facebook} rel="noreferrer" target="_blank"
				><Icon name="facebook" size={18} /> Facebook</a
			>
			<a class="btn-ink !px-3 !py-2 !text-sm sm:!px-6 sm:!text-base" href={site.tiktok} rel="noreferrer" target="_blank"
				><Icon name="tiktok" size={18} /> TikTok</a
			>
			<a class="btn-ink !px-3 !py-2 !text-sm sm:!px-6 sm:!text-base" href={site.youtube} rel="noreferrer" target="_blank"
				><Icon name="youtube" size={18} /> YouTube</a
			>
		</div>
		<a class="btn-hot mt-4 w-full sm:w-auto" href="/rezervacie#dopyt"
			><Icon name="send" size={18} /> Rezervácia / dopyt</a
		>
	</div>
</section>
