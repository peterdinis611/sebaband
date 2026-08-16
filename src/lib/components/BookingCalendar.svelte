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
	import { afterPaint } from '$lib/motion-prefs';

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
		return afterPaint(() => {
			void import('$lib/motion').then((m) => {
				if (grid) m.playCalendarDays(grid);
			});
		});
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
		void import('$lib/motion').then((m) => m.pulsePick(el));
		if (linkToBooking) {
			await goto(`/rezervacie?datum=${iso}#dopyt`);
		}
	}
</script>

<div class="ticket ticket-mobile p-2.5 sm:p-5 md:p-8">
	<div class="mb-4 flex items-center justify-between gap-2 px-0 sm:mb-6 sm:px-3">
		<button
			type="button"
			class="btn-ink grid h-11 w-11 shrink-0 place-items-center !px-0 !py-0 touch-manipulation sm:h-auto sm:w-auto sm:!px-3 sm:!py-2"
			onclick={prev}
			aria-label="Predchádzajúci mesiac"
		>
			<Icon name="prev" size={22} />
		</button>
		<p
			class="display min-w-0 flex-1 text-center text-[clamp(1.35rem,6vw,2.5rem)] leading-[0.9] capitalize md:text-5xl"
		>
			{monthNames[month]}
			<span class="text-paprika">{year}</span>
		</p>
		<button
			type="button"
			class="btn-ink grid h-11 w-11 shrink-0 place-items-center !px-0 !py-0 touch-manipulation sm:h-auto sm:w-auto sm:!px-3 sm:!py-2"
			onclick={next}
			aria-label="Nasledujúci mesiac"
		>
			<Icon name="next" size={22} />
		</button>
	</div>

	<div class="mb-1.5 grid grid-cols-7 gap-1 px-0 text-center sm:mb-2 sm:gap-1 sm:px-3">
		{#each weekdayNames as day (day)}
			<span class="font-display text-[0.7rem] font-extrabold uppercase text-paprika sm:text-sm"
				>{day.slice(0, 2)}</span
			>
		{/each}
	</div>

	<div bind:this={grid} class="grid grid-cols-7 gap-1 px-0 sm:gap-1 sm:px-3">
		{#each cells as cell, i (cell.iso ?? `e-${i}`)}
			{#if cell.day === null}
				<div class="aspect-square min-h-10 sm:min-h-0"></div>
			{:else if cell.iso}
				{@const booked = isBooked(cell.iso)}
				{@const past = isPast(cell.iso)}
				{@const active = selected === cell.iso}
				<button
					type="button"
					disabled={booked || past}
					onclick={(e) => cell.iso && pick(cell.iso, e.currentTarget)}
					class="cal-day aspect-square min-h-10 border-2 font-display text-sm font-extrabold touch-manipulation transition active:scale-95 sm:min-h-0
						{active ? 'border-ink bg-paprika text-foam' : ''}
						{booked && !active ? 'cursor-not-allowed border-ink/20 bg-ink/10 text-dust line-through' : ''}
						{past && !booked && !active ? 'cursor-not-allowed border-transparent text-dust' : ''}
						{!booked && !past && !active ? 'border-ink/20 bg-cream text-ink hover:border-paprika hover:bg-paprika hover:text-foam' : ''}"
					aria-label={booked
						? `${cell.day}, obsadené`
						: past
							? `${cell.day}, minulý termín`
							: `${cell.day}, voľný termín`}
					aria-pressed={active}
				>
					<span class="text-[0.95rem] sm:text-xl md:text-2xl">{cell.day}</span>
				</button>
			{/if}
		{/each}
	</div>

	<div
		class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 px-0 text-xs text-ink-soft sm:mt-6 sm:gap-5 sm:px-3 sm:text-sm"
	>
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
		<div
			class="mt-4 flex flex-col items-start justify-between gap-3 border-t-2 border-dashed border-ink/30 px-0 pt-4 sm:mt-6 sm:gap-4 sm:px-3 sm:pt-5 md:flex-row md:items-center"
		>
			<p class="min-w-0 text-sm sm:text-base">
				Lístok na
				<strong class="font-display block text-2xl uppercase text-paprika sm:inline sm:text-3xl"
					>{formatSlovakDate(selected)}</strong
				>
			</p>
			<div class="flex w-full flex-wrap gap-2 sm:w-auto sm:gap-3">
				<a class="btn-hot w-full !py-3 sm:w-auto sm:!py-3" href="tel:{site.phone}"
					><Icon name="phone" size={18} /> Zavolať</a
				>
				<a
					class="btn-ink w-full !py-3 sm:w-auto"
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
