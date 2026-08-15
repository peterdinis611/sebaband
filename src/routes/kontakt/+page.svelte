<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import InquiryForm from '$lib/components/InquiryForm.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
</script>

<Seo
	title="Kontakt — SEBA BAND | Rezervácia termínu"
	description="Kontaktujte SEBA BAND — telefón, e-mail, Facebook, TikTok, YouTube. Rezervácia termínu telefonicky alebo dopytom."
/>

<PageHero
	kicker="Kontakt"
	title="Zavolajte si termín"
	lede="Pôsobíme na Slovensku aj v zahraničí. Cestujeme za vami — sálu nemáme, parket áno."
/>

<section class="mx-auto grid max-w-[90rem] gap-8 px-4 py-16 md:grid-cols-12 md:px-7 md:py-20">
	<div class="space-y-4 md:col-span-5" data-in-stagger>
		<a class="contact-card contact-card-hot" href="tel:{site.phone}">
			<span class="icon-mark"><Icon name="phone" /></span>
			<span>
				<span class="kicker">Telefón</span>
				<span class="display mt-1 block text-4xl">{site.phoneDisplay}</span>
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
				<span class="display mt-1 block text-4xl text-foam">{site.region}</span>
			</span>
		</div>
		<div class="flex flex-wrap gap-2 pt-2">
			<a class="btn-ink" href={site.facebook} rel="noreferrer" target="_blank"
				><Icon name="facebook" size={18} /> Facebook</a
			>
			<a class="btn-ink" href={site.tiktok} rel="noreferrer" target="_blank"
				><Icon name="tiktok" size={18} /> TikTok</a
			>
			<a class="btn-ink" href={site.youtube} rel="noreferrer" target="_blank"
				><Icon name="youtube" size={18} /> YouTube</a
			>
		</div>
	</div>
	<div class="md:col-span-7" data-in data-in-delay="60">
		<InquiryForm />
	</div>
</section>
