<script lang="ts">
	import { playPageHero } from '$lib/motion';
	import { boot } from '$lib/boot.svelte';

	let {
		kicker,
		title,
		lede
	}: {
		kicker: string;
		title: string;
		lede?: string;
	} = $props();

	let root = $state<HTMLElement>();

	$effect(() => {
		if (!root || boot.locked) return;
		return playPageHero(root);
	});
</script>

<section
	bind:this={root}
	class="relative border-b-2 border-ink pt-28 pb-12 md:pt-32 md:pb-16"
>
	<div class="relative mx-auto max-w-[90rem] px-4 md:px-7">
		<div class="stamp absolute top-0 right-0 z-[1] hidden md:block">Parket plný</div>
		<p class="kicker js-await">{kicker}</p>
		<h1 class="display js-await mt-3 max-w-4xl pr-0 text-[18vw] text-ink md:max-w-5xl md:pr-40 md:text-[7.5rem]">
			{title}
		</h1>
		{#if lede}
			<p class="js-await mt-6 max-w-2xl text-xl font-light text-ink-soft">{lede}</p>
		{/if}
	</div>
</section>
