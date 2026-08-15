<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		formatSlovakDate,
		isBooked,
		isPast,
		monthNames,
		toIso,
		weekdayNames
	} from '$lib/data/bookings';
	import { site } from '$lib/data/site';
	import Icon from '$lib/components/Icon.svelte';
	import { playCalendarDays, pulsePick } from '$lib/motion';

	let {
		selected = $bindable(''),
		linkToBooking = false
	}: {
		selected?: string;
		linkToBooking?: boolean;
	} = $props();

	const now = new Date();
	let year = $state(now.getFullYear());
	let month = $state(now.getMonth());
	let grid = $state<HTMLElement>();
	let cells = $derived.by(() => {
		const first = (new Date(year, month, 1).getDay() + 6) % 7;
		const count = new Date(year, month + 1, 0).getDate();
		const out: Array<{ day: number | null; iso?: string }> = [];
		for (let i = 0; i < first; i++) out.push({ day: null });
		for (let d = 1; d <= count; d++) out.push({ day: d, iso: toIso(year, month, d) });
		return out;
	});

	$effect(() => {
		void cells;
		if (!grid) return;
		return playCalendarDays(grid);
	});

	function prev() {
		if (month === 0) {
			month = 11;
			year -= 1;
		} else month -= 1;
	}

	function next() {
		if (month === 11) {
			month = 0;
			year += 1;
		} else month += 1;
	}

	async function pick(iso: string, el: HTMLElement) {
		if (isPast(iso) || isBooked(iso)) return;
		selected = iso;
		pulsePick(el);
		if (linkToBooking) {
			await goto(`/rezervacie?datum=${iso}#dopyt`);
		}
	}
</script>

<div class="ticket p-5 md:p-8">
	<div class="mb-6 flex items-center justify-between gap-3 px-3">
		<button type="button" class="btn-ink !px-3 !py-2 !text-base" onclick={prev} aria-label="Predchádzajúci mesiac">
			←
		</button>
		<p class="display text-4xl capitalize md:text-5xl">
			{monthNames[month]}
			<span class="text-paprika">{year}</span>
		</p>
		<button type="button" class="btn-ink !px-3 !py-2 !text-base" onclick={next} aria-label="Nasledujúci mesiac">
			→
		</button>
	</div>

	<div class="mb-2 grid grid-cols-7 gap-1 px-3 text-center">
		{#each weekdayNames as day (day)}
			<span class="font-display text-sm font-extrabold uppercase text-paprika">{day}</span>
		{/each}
	</div>

	<div bind:this={grid} class="grid grid-cols-7 gap-1 px-3">
		{#each cells as cell, i (cell.iso ?? `e-${i}`)}
			{#if cell.day === null}
				<div class="aspect-square"></div>
			{:else if cell.iso}
				{@const booked = isBooked(cell.iso)}
				{@const past = isPast(cell.iso)}
				{@const active = selected === cell.iso}
				<button
					type="button"
					disabled={booked || past}
					onclick={(e) => cell.iso && pick(cell.iso, e.currentTarget)}
					class="aspect-square border-2 text-sm font-display font-extrabold transition
						{active ? 'border-ink bg-paprika text-foam' : ''}
						{booked && !active ? 'cursor-not-allowed border-ink/20 bg-ink/10 text-dust line-through' : ''}
						{past && !booked && !active ? 'cursor-not-allowed border-transparent text-dust' : ''}
						{!booked && !past && !active ? 'border-ink/20 bg-cream text-ink hover:border-paprika hover:bg-paprika hover:text-foam' : ''}"
					aria-label={booked
						? `${cell.day}, obsadené`
						: past
							? `${cell.day}, minulý termín`
							: `${cell.day}, voľný termín`}
				>
					<span class="text-xl md:text-2xl">{cell.day}</span>
				</button>
			{/if}
		{/each}
	</div>

	<div class="mt-6 flex flex-wrap items-center gap-5 px-3 text-sm text-ink-soft">
		<span class="flex items-center gap-2">
			<i class="inline-block h-3 w-3 border-2 border-ink bg-cream"></i> Voľný
		</span>
		<span class="flex items-center gap-2">
			<i class="inline-block h-3 w-3 bg-ink/20"></i> Obsadené
		</span>
		<span class="flex items-center gap-2">
			<i class="inline-block h-3 w-3 bg-paprika"></i> Vybrané
		</span>
	</div>

	{#if selected}
		<div class="mt-6 flex flex-col items-start justify-between gap-4 border-t-2 border-dashed border-ink/30 px-3 pt-5 md:flex-row md:items-center">
			<p>
				Lístok na <strong class="font-display text-3xl uppercase text-paprika">{formatSlovakDate(selected)}</strong>
			</p>
			<div class="flex flex-wrap gap-3">
				<a class="btn-hot" href="tel:{site.phone}"><Icon name="phone" size={18} /> Zavolať</a>
				<a
					class="btn-ink"
					href="mailto:{site.email}?subject={encodeURIComponent(
						`Rezervácia SEBA BAND — ${formatSlovakDate(selected)}`
					)}"
				>
					<Icon name="mail" size={18} /> E-mail
				</a>
			</div>
		</div>
	{/if}
</div>
