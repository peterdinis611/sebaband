<script lang="ts">
	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	const status = $derived(page.status || 500);
	const is404 = $derived(status === 404);
	const title = $derived(
		is404 ? 'Stránka sa nenašla — SEBA BAND' : `Chyba ${status} — SEBA BAND`
	);
	const headline = $derived(is404 ? 'Pauza' : 'Výpadok');
	const lede = $derived(
		is404
			? 'Táto stránka neexistuje, alebo sa medzičasom presunula. Späť na úvod, alebo rovno termín.'
			: 'Niečo sa pokazilo na našej strane. Skúste to znova o chvíľu — alebo nám zavolajte.'
	);
	const stamp = $derived(is404 ? 'Mimo set' : 'Technika');
</script>

<Seo {title} noindex />

<section class="error-sheet relative overflow-x-clip px-4 pt-28 pb-20 md:px-7 md:pt-36 md:pb-28">
	<div class="error-mesh" aria-hidden="true"></div>

	<div class="relative mx-auto grid max-w-[90rem] items-end gap-10 md:grid-cols-12">
		<div class="md:col-span-7">
			<p class="kicker">{status}</p>
			<p class="stamp mt-6 inline-block">{stamp}</p>
			<h1 class="display mt-6 text-[clamp(4.5rem,22vw,9rem)] text-ink md:text-[9.5rem]">
				{headline}
			</h1>
			<p class="mt-5 max-w-lg text-lg font-light text-ink-soft md:text-xl">{lede}</p>

			<div class="mt-10 flex flex-wrap gap-3">
				<a class="btn-hot" href="/">Domov</a>
				{#if is404}
					<a class="btn-ink" href="/rezervacie">Rezervácie</a>
					<a class="btn-ink" href="/kontakt">Kontakt</a>
				{:else}
					<button type="button" class="btn-ink" onclick={() => location.reload()}>Skúsiť znova</button>
					<a class="btn-ink" href="tel:{site.phone}"
						><Icon name="phone" size={18} /> {site.phoneDisplay}</a
					>
				{/if}
			</div>
		</div>

		<div class="md:col-span-4 md:col-start-9">
			<div
				class="border-2 border-ink bg-cream p-6 shadow-[10px_10px_0_var(--color-punch)] md:p-8"
				data-in
			>
				<p class="font-display text-sm font-extrabold tracking-[0.2em] text-paprika uppercase">
					SEBA BAND
				</p>
				<p class="display mt-3 text-4xl text-ink md:text-5xl">
					{#if is404}
						Žiadny<br /><span class="text-paprika">track</span>
					{:else}
						Krátka<br /><span class="text-paprika">prestávka</span>
					{/if}
				</p>
				<p class="mt-4 font-light text-ink-soft">
					{#if is404}
						Parket čaká inde — skúste galériu, videá alebo dopyt.
					{:else}
						Ozvite sa, ak to trvá. My to dáme do poriadku.
					{/if}
				</p>
				{#if !is404 && page.error?.message}
					<p
						class="mt-5 border-t-2 border-dashed border-ink/25 pt-4 font-mono text-xs break-all text-dust"
					>
						{page.error.message}
					</p>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.error-sheet {
		min-height: calc(100svh - 4rem);
	}

	.error-mesh {
		pointer-events: none;
		position: absolute;
		inset: 8% -8% auto;
		height: 55%;
		background:
			radial-gradient(ellipse at 20% 30%, color-mix(in srgb, var(--color-paprika) 18%, transparent), transparent 55%),
			radial-gradient(ellipse at 85% 10%, color-mix(in srgb, var(--color-pine) 16%, transparent), transparent 50%);
		transform: rotate(-3deg);
	}
</style>
