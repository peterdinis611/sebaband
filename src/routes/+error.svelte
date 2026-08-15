<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Stránka sa nenašla — SEBA BAND" />

<section class="flex min-h-[80svh] flex-col items-center justify-center px-5 text-center">
	<p class="kicker">{page.status}</p>
	<h1 class="display mt-3 text-7xl">Pauza</h1>
	<p class="mt-4 max-w-md font-light text-ink-soft">Táto stránka neexistuje. Späť na úvod, alebo rovno termín.</p>
	<div class="mt-10 flex gap-3">
		<a class="btn-hot" href="/">Domov</a>
		<a class="btn-ink" href="/kontakt">Kontakt</a>
	</div>
</section>
