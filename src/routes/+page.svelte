<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SmartImage from '$lib/components/SmartImage.svelte';
	import WhenVisible from '$lib/components/WhenVisible.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { gallery } from '$lib/data/gallery';
	import { pages } from '$lib/data/seo';
	import { site } from '$lib/data/site';

	const stats = [
		{ value: '6', label: 'členov' },
		{ value: String(site.founded), label: 'založení' },
		{ value: 'SK + EU', label: 'pôsobenie' },
		{ value: 'Live', label: 'vlastná technika' }
	];
</script>

<Seo title={pages.home.title} description={pages.home.description} keywords={pages.home.keywords} />

<section class="relative overflow-x-clip pt-28 md:pt-32">
	<div class="js-hero mx-auto grid max-w-[90rem] items-start gap-6 px-4 pb-10 md:grid-cols-12 md:px-7 md:pb-12">
		<div class="js-hero-copy md:col-span-6 lg:col-span-5">
			<p class="kicker js-hero-kicker">{site.kicker}</p>
			<h1
				class="display js-hero-title mt-3 text-[clamp(3rem,14vw,4.75rem)] text-ink sm:text-8xl md:mt-4 md:text-[7.25rem]"
			>
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
			<div
				class="max-md:rotate-0 -rotate-2 overflow-hidden border-2 border-ink bg-cream shadow-[8px_8px_0_var(--color-paprika)] md:shadow-[12px_12px_0_var(--color-paprika)]"
			>
				<div data-parallax="0.16" class="will-change-transform">
					<SmartImage
						src="/images/hero-band.jpg"
						alt="Členovia kapely SEBA BAND v elegantnom čiernom oblečení"
						width={1400}
						height={1050}
						priority
						sizes="(min-width: 768px) 50vw, 100vw"
						class="block scale-[1.14]"
						imgClass="aspect-[4/3] w-full object-cover object-[50%_8%]"
					/>
				</div>
			</div>
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

<section class="mx-auto max-w-[90rem] overflow-x-clip px-4 py-16 md:px-7 md:py-24">
	<div class="grid items-center gap-12 md:grid-cols-12">
		<Reveal class="md:col-span-6 lg:col-span-5">
			<p class="kicker">O nás</p>
			<h2 class="display mt-3 text-4xl sm:text-5xl md:text-7xl">
				Hudba, ktorá<br /><span class="text-paprika">spája</span>
			</h2>
			<p class="mt-5 max-w-xl text-lg font-light text-ink-soft">
				SEBA BAND vznikla v roku {site.founded} ako kapela bratov a bratrancov. Východniarsky a pavlovský
				štýl, ľudovky, rock aj moderné hity. Vlastná technika, moderovanie, plný parket.
			</p>
			<a class="btn-ink mt-8" href="/o-nas">Celý príbeh</a>
		</Reveal>
		<Reveal class="relative md:col-span-6 lg:col-span-6 lg:col-start-7">
			<div
				class="max-md:rotate-0 rotate-2 overflow-hidden border-2 border-ink shadow-[10px_10px_0_var(--color-punch)]"
			>
				<div data-parallax="0.14" class="will-change-transform">
					<SmartImage
						src="/images/img-3497.jpg"
						alt="Kapela SEBA BAND spoločne pred akciou"
						width={1400}
						height={1080}
						sizes="(min-width: 768px) 45vw, 100vw"
						class="block scale-[1.12]"
						imgClass="aspect-[4/5] w-full object-cover object-top"
					/>
				</div>
			</div>
			<div
				class="absolute bottom-2 left-2 md:-bottom-6 md:-left-4"
				data-parallax="0.05"
			>
				<div
					class="border-2 border-ink bg-paprika px-4 py-3 text-foam shadow-[6px_6px_0_var(--color-punch)] md:px-5 md:py-4"
				>
					<p class="display text-5xl">6</p>
					<p class="font-display text-xs font-extrabold uppercase">členov na pódiu</p>
				</div>
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
		<WhenVisible minHeight="18rem">
			{#await import('$lib/components/GalleryGrid.svelte') then { default: GalleryGrid }}
				<GalleryGrid items={gallery} limit={4} />
			{/await}
		</WhenVisible>
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
			<WhenVisible minHeight="14rem">
				{#await import('$lib/components/VideoGrid.svelte') then { default: VideoGrid }}
					<VideoGrid featured />
				{/await}
			</WhenVisible>
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
			<WhenVisible minHeight="22rem">
				{#await import('$lib/components/BookingCalendar.svelte') then { default: BookingCalendar }}
					<BookingCalendar linkToBooking />
				{/await}
			</WhenVisible>
		</div>
	</div>
</section>

<section class="border-y-2 border-ink bg-paper-2 py-16 md:py-20" data-in>
	<div class="mx-auto max-w-[90rem] px-4 md:px-7">
		<p class="kicker">Časté otázky</p>
		<h2 class="display mt-2 max-w-3xl text-4xl sm:text-5xl md:text-6xl">
			Kapela na svadbu, ples aj oslavu
		</h2>
		<p class="mt-4 max-w-2xl font-light text-ink-soft">
			Hľadáte rómsku live kapelu alebo živú hudbu na svadbu na Slovensku? SEBA BAND hrá ľudovky,
			rock aj moderné hity — s vlastnou technikou a plným parketom.
		</p>
		<div class="mt-10 grid gap-0 border-2 border-ink md:grid-cols-2">
			{#each [
				{
					q: 'Ste kapela na svadbu?',
					a: 'Áno. SEBA BAND je rómska live kapela na svadby, plesy, oslavy, zábavy, festivaly a firemné akcie.'
				},
				{
					q: 'Hráte aj v zahraničí?',
					a: 'Áno — Slovensko, Česko aj ďalšie krajiny EÚ. Termín a logistiku dohodneme individuálne.'
				},
				{
					q: 'Máte vlastnú techniku?',
					a: 'Áno. Zvuk, svetlá aj moderovanie. Prídeme pripravení, aby parket ostal plný.'
				},
				{
					q: 'Ako rezervujem termín?',
					a: 'Pozrite kalendár v Rezerváciách, potom volajte, píšte e-mail alebo vyplňte dopyt.'
				}
			] as item (item.q)}
				<article class="border-ink p-5 md:border-r-2 md:odd:border-b-2 md:even:border-b-2 md:[&:nth-child(3)]:border-b-0 md:[&:nth-child(4)]:border-b-0 md:p-7">
					<h3 class="display text-2xl md:text-3xl">{item.q}</h3>
					<p class="mt-2 font-light text-ink-soft">{item.a}</p>
				</article>
			{/each}
		</div>
		<p class="mt-8 text-sm text-dust">
			Kľúčové služby: kapela na svadbu · kapela na ples · kapela na oslavu · živá hudba Slovensko ·
			rómska kapela · wedding band Slovakia
		</p>
	</div>
</section>

<section class="relative overflow-hidden" data-in>
	<div class="absolute inset-0 overflow-hidden" aria-hidden="true">
		<div data-parallax="0.28" class="absolute inset-[-12%] will-change-transform">
			<SmartImage
				src="/images/img-3496.jpg"
				alt=""
				width={1400}
				height={1050}
				sizes="100vw"
				class="h-full w-full"
				imgClass="h-full w-full object-cover object-[50%_20%]"
			/>
		</div>
	</div>
	<div class="absolute inset-0 cta-band-scrim bg-paprika/88"></div>
	<div class="relative mx-auto max-w-3xl px-4 py-20 text-center text-foam md:py-28" data-parallax="0.06">
		<p class="stamp !border-foam !text-foam">Termín</p>
		<h2 class="display mt-6 text-5xl md:text-7xl">Zavolajte nám</h2>
		<p class="mt-4 text-lg font-light text-foam/90">Preberieme program vašej akcie. Bez omáčky.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a
				class="btn-on-dark !px-3 !text-sm sm:!px-6 sm:!text-base"
				href="tel:{site.phone}"
				><Icon name="phone" size={18} />
				<span class="sm:hidden">Volajte</span>
				<span class="hidden sm:inline">{site.phoneDisplay}</span></a
			>
			<a class="btn-on-dark-fill !px-3 !text-sm sm:!px-6 sm:!text-base" href="/rezervacie#dopyt"
				><Icon name="send" size={18} /> Dopyt</a
			>
		</div>
	</div>
</section>
