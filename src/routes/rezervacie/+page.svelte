<script lang="ts">
	import { page } from '$app/state';
	import BookingCalendar from '$lib/components/BookingCalendar.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import InquiryForm from '$lib/components/InquiryForm.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	let selected = $state('');

	$effect(() => {
		const datum = page.url.searchParams.get('datum');
		if (datum) selected = datum;
	});
</script>

<Seo
	title="Rezervácie — SEBA BAND | Rezervačný kalendár"
	description="Rezervačný kalendár SEBA BAND — voľné termíny rezervujete telefonicky, e-mailom alebo dopytom."
/>

<PageHero
	kicker="Rezervácie"
	title="Vstupenka na dátum"
	lede="Obsadené dni sú prečiarknuté. Voľný termín rezervujete telefonicky, e-mailom, alebo dopytom."
/>

<div class="mx-auto grid max-w-[90rem] gap-4 px-4 md:grid-cols-2 md:px-7">
	<a class="contact-card contact-card-hot" href="tel:{site.phone}">
		<span class="icon-mark"><Icon name="phone" /></span>
		<span>
			<span class="kicker">Telefón</span>
			<span class="display mt-1 block text-3xl md:text-4xl">{site.phoneDisplay}</span>
		</span>
	</a>
	<a class="contact-card" href="mailto:{site.email}">
		<span class="icon-mark icon-mark-ink"><Icon name="mail" /></span>
		<span>
			<span class="kicker">E-mail</span>
			<span class="mt-1 block break-all font-display text-xl font-extrabold uppercase md:text-2xl"
				>{site.email}</span
			>
		</span>
	</a>
</div>

<section class="mx-auto grid max-w-[90rem] gap-10 px-4 py-16 md:grid-cols-12 md:px-7 md:py-20">
	<div class="md:col-span-7" data-in>
		<BookingCalendar bind:selected />
	</div>
	<div class="md:col-span-5" data-in data-in-delay="80">
		<InquiryForm bind:selectedDate={selected} />
	</div>
</section>
