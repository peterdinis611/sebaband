<script lang="ts">
	import BookingCalendar from '$lib/components/BookingCalendar.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SmartImage from '$lib/components/SmartImage.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { gallery } from '$lib/data/gallery';
	import { site } from '$lib/data/site';
	import { boot } from '$lib/boot.svelte';
	import { playLanding } from '$lib/motion';

	const stats = [
		{ value: '6', label: 'členov' },
		{ value: String(site.founded), label: 'založení' },
		{ value: 'SK + EU', label: 'pôsobenie' },
		{ value: 'Live', label: 'vlastná technika' }
	];

	let landing = $state<HTMLElement>();

	$effect(() => {
		if (!landing || boot.locked) return;
		return playLanding(landing);
	});
</script>

<Seo title="SEBA BAND — Živá hudba na svadby, plesy a oslavy" description={site.description} />

<section bind:this={landing} class="relative overflow-hidden pt-20">
	<div class="js-hero mx-auto grid max-w-[90rem] items-start gap-6 px-4 pb-10 md:grid-cols-12 md:px-7 md:pb-12">
		<div class="md:col-span-6 lg:col-span-5">
			<p class="kicker js-hero-kicker">{site.kicker}</p>
			<h1 class="display js-hero-title mt-4 text-[18vw] text-ink sm:text-8xl md:text-[7.25rem]">
				SEBA<br /><span class="text-paprika">BAND</span>
			</h1>
			<p class="js-hero-lede mt-5 max-w-md text-lg font-light text-ink-soft md:text-xl">
				Šesť členov. Jedna rodina. Parket plný od prvej pesničky — svadby, plesy a zábavy na Slovensku
				aj v zahraničí.
			</p>
			<div class="js-hero-ctas mt-8 flex flex-wrap gap-3">
				<a class="btn-hot" href="tel:{site.phone}"><Icon name="phone" size={18} /> Rezervácia</a>
				<a class="btn-ink" href="/videa">Videá</a>
			</div>
			<p
				class="js-hero-region mt-5 font-display text-sm font-extrabold tracking-wider text-dust uppercase"
			>
				{site.region}
			</p>
		</div>

		<div class="js-hero-photo relative md:col-span-6 md:-mt-2 lg:col-span-7 lg:-mt-8">
			<SmartImage
				src="/images/hero-band.jpg"
				alt="Členovia kapely SEBA BAND v elegantnom čiernom oblečení"
				width={1400}
				height={1050}
				priority
				sizes="(min-width: 768px) 50vw, 100vw"
				class="block -rotate-2 overflow-hidden border-2 border-ink bg-cream shadow-[12px_12px_0_var(--color-paprika)]"
				imgClass="aspect-[4/3] w-full object-cover object-[50%_8%]"
			/>
		</div>
	</div>

	<ul class="mx-auto grid max-w-[90rem] grid-cols-2 border-y-2 border-ink md:grid-cols-4">
		{#each stats as stat (stat.label)}
			<li class="js-stat border-ink px-4 py-4 md:border-r-2 md:px-7 md:last:border-r-0">
				<p class="display text-3xl text-paprika md:text-4xl">{stat.value}</p>
				<p class="font-display text-sm font-extrabold uppercase tracking-wide text-ink-soft">{stat.label}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="mx-auto max-w-[90rem] px-4 py-16 md:px-7 md:py-24">
	<div class="grid items-center gap-12 md:grid-cols-12">
		<Reveal class="md:col-span-6 lg:col-span-5">
			<p class="kicker">O nás</p>
			<h2 class="display mt-3 text-5xl md:text-7xl">
				Hudba, ktorá<br /><span class="text-paprika">spája</span>
			</h2>
			<p class="mt-5 max-w-xl text-lg font-light text-ink-soft">
				SEBA BAND vznikla v roku {site.founded} ako kapela bratov a bratrancov. Východniarsky a pavlovský
				štýl, ľudovky, rock aj moderné hity. Vlastná technika, moderovanie, plný parket.
			</p>
			<a class="btn-ink mt-8" href="/o-nas">Celý príbeh</a>
		</Reveal>
		<Reveal class="relative md:col-span-6 lg:col-span-6 lg:col-start-7">
			<SmartImage
				src="/images/img-3497.jpg"
				alt="Kapela SEBA BAND spoločne pred akciou"
				width={1400}
				height={1080}
				sizes="(min-width: 768px) 45vw, 100vw"
				class="block rotate-2 overflow-hidden border-2 border-ink shadow-[10px_10px_0_var(--color-punch)]"
				imgClass="aspect-[4/5] w-full object-cover object-top"
			/>
			<div
				class="absolute -bottom-6 -left-2 border-2 border-ink bg-paprika px-5 py-4 text-foam shadow-[6px_6px_0_var(--color-punch)] md:-left-4"
			>
				<p class="display text-5xl">6</p>
				<p class="font-display text-xs font-extrabold uppercase">členov na pódiu</p>
			</div>
		</Reveal>
	</div>

	<div class="mt-20 grid gap-0 border-2 border-ink md:grid-cols-3" data-in-stagger>
		{#each [
			{ n: '01', title: 'Rodina', text: 'Bratia a bratranci. Jedna krv, jeden set.' },
			{ n: '02', title: 'Repertoár', text: site.repertoire },
			{ n: '03', title: 'Technika', text: 'Zvuk, svetlá, moderovanie. Prídeme pripravení.' }
		] as item (item.n)}
			<div class="border-ink p-7 md:border-r-2 md:last:border-r-0">
				<p class="display text-4xl text-paprika">{item.n}</p>
				<h3 class="display mt-2 text-3xl">{item.title}</h3>
				<p class="mt-2 font-light text-ink-soft">{item.text}</p>
			</div>
		{/each}
	</div>
</section>

<section class="bg-paper-2 py-16 md:py-24" data-in>
	<div class="mx-auto max-w-[90rem] px-4 md:px-7">
		<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<p class="kicker">Galéria</p>
				<h2 class="display mt-2 text-5xl md:text-6xl">Z parketu</h2>
			</div>
			<a class="btn-ink" href="/galeria">Viac fotiek</a>
		</div>
		<GalleryGrid items={gallery} limit={4} />
	</div>
</section>

<section class="bg-pine py-16 text-foam md:py-24" data-in>
	<div class="mx-auto max-w-[90rem] px-4 md:px-7">
		<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<p class="kicker">Videá</p>
				<h2 class="display mt-2 text-5xl text-foam md:text-6xl">Naživo</h2>
			</div>
			<a class="btn-hot" href="/videa">Všetky klipy</a>
		</div>
		<div class="mt-10">
			<VideoGrid featured />
		</div>
	</div>
</section>

<section class="mx-auto max-w-[90rem] px-4 py-16 md:px-7 md:py-24" data-in>
	<div class="grid items-start gap-8 md:grid-cols-12">
		<div class="md:col-span-4">
			<p class="kicker">Rezervácie</p>
			<h2 class="display mt-2 text-5xl md:text-6xl">Lístok na dátum</h2>
			<p class="mt-4 font-light text-ink-soft">
				Kalendár ako vstupenka. Voľný deň kliknete — a voláte, alebo vyplníte dopyt.
			</p>
			<a class="btn-hot mt-8" href="/rezervacie">Celý kalendár</a>
		</div>
		<div class="md:col-span-8">
			<BookingCalendar linkToBooking />
		</div>
	</div>
</section>

<section class="relative overflow-hidden" data-in>
	<SmartImage
		src="/images/img-3496.jpg"
		alt=""
		width={1400}
		height={1050}
		sizes="100vw"
		class="absolute inset-0 h-full w-full"
		imgClass="h-full w-full object-cover object-[50%_20%]"
	/>
	<div class="absolute inset-0 bg-paprika/88"></div>
	<div class="relative mx-auto max-w-3xl px-4 py-20 text-center text-foam md:py-28">
		<p class="stamp !border-foam !text-foam">Termín</p>
		<h2 class="display mt-6 text-5xl md:text-7xl">Zavolajte nám</h2>
		<p class="mt-4 text-lg font-light text-foam/90">Preberieme program vašej akcie. Bez omáčky.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a
				class="btn-ink !border-foam !text-foam hover:!bg-foam hover:!text-paprika"
				href="tel:{site.phone}"><Icon name="phone" size={18} /> {site.phoneDisplay}</a
			>
			<a class="btn-ink !border-foam !bg-foam !text-ink" href="/rezervacie#dopyt"
				><Icon name="send" size={18} /> Dopyt</a
			>
		</div>
	</div>
</section>
