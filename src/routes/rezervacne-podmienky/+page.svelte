<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { pages } from '$lib/data/seo';
	import { site } from '$lib/data/site';
</script>

<Seo title={pages.terms.title} description={pages.terms.description} keywords={pages.terms.keywords} />

<PageHero kicker="Rezervácia" title="Podmienky" />

<section class="mx-auto max-w-3xl px-4 py-16 md:px-7 md:py-20">
	<article class="border-2 border-ink bg-cream p-8 shadow-[8px_8px_0_var(--color-punch)] md:p-12" data-in>
		<p class="font-light text-ink-soft">
			Vážení zákazníci, vopred ďakujeme za dôveru a za prečítanie podmienok, na ktorých staviame
			každý termín.
		</p>
		<p class="mt-5 font-light text-ink-soft">
			Záloha slúži na záväznú rezerváciu termínu. Pri zrušení vystúpenia z vašej strany sa záloha
			nevracia.
		</p>
		<p class="mt-5 font-light text-ink-soft">
			Ak zrušíme vystúpenie my, celá uhradená záloha vám bude vrátená v plnej výške.
		</p>
		<p class="mt-5 font-light text-ink-soft">
			Pri vážnych okolnostiach (napríklad úmrtie v rodine) o zálohu neprídete. Po dohode ostane ako
			kredit na nový termín.
		</p>
		<p class="mt-8 font-display text-3xl font-extrabold uppercase">{site.name}</p>
		<a class="btn-hot mt-8" href="/rezervacie">Späť na rezervácie</a>
	</article>
</section>
