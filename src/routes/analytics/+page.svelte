<script lang="ts">
	import ClickHeatmap from '$lib/components/ClickHeatmap.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import {
		clearHits,
		getHits,
		totalHits,
		type HitRow
	} from '$lib/analytics.svelte';
	import { bookedDates, formatSlovakDate, isPast } from '$lib/data/bookings';
	import { gallery } from '$lib/data/gallery';
	import { nav, site } from '$lib/data/site';
	import { videos } from '$lib/data/videos';

	const today = new Date();
	const upcoming = bookedDates.filter((d) => !isPast(d, today));
	const pastBooked = bookedDates.filter((d) => isPast(d, today));

	const byMonth = bookedDates.reduce<Record<string, number>>((acc, iso) => {
		const key = iso.slice(0, 7);
		acc[key] = (acc[key] ?? 0) + 1;
		return acc;
	}, {});

	const monthRows = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b));

	let hits = $state<HitRow[]>([]);
	let hitTotal = $state(0);

	function refreshHits() {
		hits = getHits();
		hitTotal = totalHits(hits);
	}

	$effect(() => {
		refreshHits();
	});

	function wipe() {
		clearHits();
		refreshHits();
	}

	const inventory = [
		{ label: 'Fotky v galérii', value: String(gallery.length) },
		{ label: 'Videá', value: String(videos.length) },
		{ label: 'Obsadené termíny', value: String(bookedDates.length) },
		{ label: 'Členovia', value: String(site.members) },
		{ label: 'Založení', value: String(site.founded) },
		{ label: 'Verejné stránky', value: String(nav.length) }
	];

	const heatPaths = [...nav.map((n) => n.href), '/rezervacne-podmienky'];
</script>

<Seo
	title="Analytics — SEBA BAND"
	description="Interný prehľad obsahu, návštev a heatmapy klikov webu SEBA BAND."
	noindex
/>

<section class="border-b-2 border-ink pt-28 pb-10 md:pt-32">
	<div class="mx-auto max-w-[90rem] px-4 md:px-7">
		<p class="kicker">Interné · mimo menu</p>
		<h1 class="display mt-3 text-[14vw] text-ink md:text-[6.5rem]">Analytics</h1>
		<p class="mt-4 max-w-xl text-lg font-light text-ink-soft">
			Skrytý prehľad pre kapelu — nie je v navigácii ani vo footeri. Hit-y a kliky sú len v tomto
			prehliadači (Clarity-štýl mapa).
		</p>
	</div>
</section>

<section class="border-b-2 border-ink bg-cream/40">
	<div class="mx-auto max-w-[90rem] px-4 py-14 md:px-7 md:py-16">
		<p class="kicker">Click map</p>
		<h2 class="display mt-2 text-4xl md:text-6xl">Kde ľudia klikajú</h2>
		<p class="mt-3 max-w-2xl font-light text-ink-soft">
			Každý klik na webe sa ukladá lokálne. Vyber stránku a pozri heatmapu — horúce miesta sú paprika.
		</p>
		<div class="mt-8">
			<ClickHeatmap paths={heatPaths} />
		</div>
	</div>
</section>

<section class="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 md:grid-cols-12 md:px-7 md:py-20">
	<div class="md:col-span-5">
		<p class="kicker">Inventár webu</p>
		<ul class="mt-6 divide-y-2 divide-ink border-2 border-ink bg-cream">
			{#each inventory as row (row.label)}
				<li class="flex items-baseline justify-between gap-4 px-4 py-3">
					<span class="font-display text-sm font-extrabold tracking-wide text-ink-soft uppercase"
						>{row.label}</span
					>
					<span class="display text-3xl text-paprika">{row.value}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="md:col-span-7">
		<p class="kicker">Rezervácie</p>
		<div class="mt-6 grid gap-4 sm:grid-cols-3">
			<div class="border-2 border-ink bg-paprika p-4 text-foam shadow-[6px_6px_0_var(--color-punch)]">
				<p class="font-display text-xs font-extrabold tracking-widest uppercase opacity-80">Celkom</p>
				<p class="display mt-1 text-5xl">{bookedDates.length}</p>
			</div>
			<div class="border-2 border-ink bg-cream p-4 shadow-[6px_6px_0_var(--color-punch)]">
				<p class="font-display text-xs font-extrabold tracking-widest text-dust uppercase">Najbližšie</p>
				<p class="display mt-1 text-5xl text-ink">{upcoming.length}</p>
			</div>
			<div class="border-2 border-ink bg-pine p-4 text-foam shadow-[6px_6px_0_var(--color-punch)]">
				<p class="font-display text-xs font-extrabold tracking-widest uppercase opacity-80">Minulé</p>
				<p class="display mt-1 text-5xl">{pastBooked.length}</p>
			</div>
		</div>

		<div class="mt-6 overflow-x-auto border-2 border-ink bg-cream">
			<table class="w-full min-w-[28rem] text-left">
				<thead class="border-b-2 border-ink bg-paper-2">
					<tr>
						<th class="px-4 py-3 font-display text-sm font-extrabold uppercase">Mesiac</th>
						<th class="px-4 py-3 font-display text-sm font-extrabold uppercase">Termíny</th>
						<th class="px-4 py-3 font-display text-sm font-extrabold uppercase">Bar</th>
					</tr>
				</thead>
				<tbody>
					{#each monthRows as [month, count] (month)}
						{@const max = Math.max(...monthRows.map(([, c]) => c), 1)}
						<tr class="border-b border-ink/30 last:border-0">
							<td class="px-4 py-3 font-display font-extrabold">{month}</td>
							<td class="px-4 py-3">{count}</td>
							<td class="px-4 py-3">
								<span class="block h-3 bg-paprika" style="width: {(count / max) * 100}%"></span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<p class="kicker mt-10">Najbližšie obsadené</p>
		<ul class="mt-4 flex flex-wrap gap-2">
			{#each upcoming.slice(0, 8) as iso (iso)}
				<li class="border-2 border-ink bg-cream px-3 py-1 font-display text-sm font-extrabold uppercase">
					{formatSlovakDate(iso)}
				</li>
			{:else}
				<li class="text-ink-soft">Žiadne budúce termíny v zozname.</li>
			{/each}
		</ul>
	</div>
</section>

<section class="border-t-2 border-ink bg-paper-2">
	<div class="mx-auto max-w-[90rem] px-4 py-14 md:px-7 md:py-16">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="kicker">Lokálne návštevy</p>
				<h2 class="display mt-2 text-4xl md:text-5xl">{hitTotal} hitov</h2>
				<p class="mt-2 max-w-lg font-light text-ink-soft">
					Počítadlo v <code class="font-display">localStorage</code> tohto prehliadača — nie Google
					Analytics.
				</p>
			</div>
			<button type="button" class="btn-ink" onclick={wipe}>Vymazať hit-y</button>
		</div>

		{#if hits.length}
			<div class="mt-8 overflow-x-auto border-2 border-ink bg-cream">
				<table class="w-full min-w-[32rem] text-left">
					<thead class="border-b-2 border-ink">
						<tr>
							<th class="px-4 py-3 font-display text-sm font-extrabold uppercase">Cesta</th>
							<th class="px-4 py-3 font-display text-sm font-extrabold uppercase">Hit-y</th>
							<th class="px-4 py-3 font-display text-sm font-extrabold uppercase">Naposledy</th>
						</tr>
					</thead>
					<tbody>
						{#each hits as row (row.path)}
							<tr class="border-b border-ink/25 last:border-0">
								<td class="px-4 py-3 font-display font-extrabold">{row.path}</td>
								<td class="px-4 py-3 text-paprika">{row.count}</td>
								<td class="px-4 py-3 text-sm text-ink-soft">
									{new Date(row.last).toLocaleString('sk-SK')}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="mt-8 border-2 border-dashed border-ink/40 px-4 py-8 text-ink-soft">
				Zatiaľ žiadne hit-y. Prejdi pár stránok a vráť sa sem.
			</p>
		{/if}
	</div>
</section>
