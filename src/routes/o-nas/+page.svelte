<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SmartImage from '$lib/components/SmartImage.svelte';
	import { pages } from '$lib/data/seo';
	import { site } from '$lib/data/site';
</script>

<Seo title={pages.about.title} description={pages.about.description} keywords={pages.about.keywords} />

<PageHero
	kicker="O nás"
	title="Jedna rodina jeden parket"
	lede="Šesť členov — bratia a bratranci, ktorých spája krv aj hudba."
/>

<section class="mx-auto grid max-w-[90rem] items-center gap-12 overflow-x-clip px-4 py-16 md:grid-cols-12 md:px-7">
	<Reveal class="md:col-span-6">
		<div
			class="max-md:rotate-0 -rotate-2 overflow-hidden border-2 border-ink shadow-[10px_10px_0_var(--color-paprika)]"
		>
			<SmartImage
				src="/images/hero-band.jpg"
				alt="Členovia kapely SEBA BAND v elegantnom čiernom oblečení"
				width={1400}
				height={1050}
				sizes="(min-width: 768px) 50vw, 100vw"
				class="block scale-[1.12]"
				imgClass="aspect-[4/3] w-full object-cover object-[50%_18%]"
			/>
		</div>
	</Reveal>
	<Reveal class="md:col-span-5 md:col-start-8">
		<p class="kicker">Od {site.founded}</p>
		<h2 class="display mt-3 text-5xl">Sme kapela aj rodina</h2>
		<p class="mt-5 font-light text-ink-soft">
			SEBA BAND je rómska live kapela. Na pódium vystupujeme ako bratia a bratranci — s rešpektom k
			tradícii aj s chuťou zahrať to, pri čom sa dnes tancuje do rána.
		</p>
		<p class="mt-4 font-light text-ink-soft">
			Svadby, oslavy, plesy, zábavy, festivaly a firemné akcie. Slovensko aj zahraničie.
		</p>
	</Reveal>
</section>

<section class="border-y-2 border-ink bg-paper-2 py-16">
	<div class="mx-auto max-w-[90rem] px-4 md:px-7">
		<p class="kicker">Čo prinášame</p>
		<div class="mt-8 grid gap-0 border-2 border-ink md:grid-cols-3" data-in-stagger>
			{#each [
				{
					title: 'Repertoár',
					text: 'Východniarsky a pavlovský štýl, ľudovky, rock aj moderné hity. Program podľa vašich hostí.'
				},
				{
					title: 'Technika',
					text: 'Vlastný zvuk a svetlá. Nemusíte zháňať ozvučenie — prídeme pripravení.'
				},
				{
					title: 'Moderovanie',
					text: 'Svadobný obriad, príchody, súťaže aj voľná zábava. Parket ostáva plný.'
				}
			] as item (item.title)}
				<article class="border-ink p-8 md:border-r-2 last:border-r-0">
					<h3 class="display text-4xl">{item.title}</h3>
					<p class="mt-3 font-light text-ink-soft">{item.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-[90rem] px-4 py-16 md:px-7">
	<div class="border-2 border-ink bg-cream p-8 shadow-[8px_8px_0_var(--color-paprika)] md:p-12" data-in>
		<p class="kicker">Pre koho hráme</p>
		<h2 class="display mt-2 text-5xl">Každý hosť si má nájsť svoje</h2>
		<ul class="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3" data-in-stagger>
			{#each site.events as event (event)}
				<li class="border-2 border-ink px-4 py-3 font-display text-lg font-extrabold uppercase">
					{event}
				</li>
			{/each}
		</ul>
	</div>
	<div class="mt-10 flex flex-wrap gap-3">
		<a class="btn-hot" href="/rezervacie">Rezervovať</a>
		<a class="btn-ink" href="/videa">Videá</a>
	</div>
</section>
