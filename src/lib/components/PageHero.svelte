<script lang="ts">
	let {
		kicker,
		title,
		lede
	}: {
		kicker: string;
		title: string;
		lede?: string;
	} = $props();
</script>

<section class="relative border-b-2 border-ink pt-28 pb-10 md:pt-36 md:pb-16">
	<div class="relative mx-auto max-w-[90rem] px-4 md:px-7">
		<div class="absolute top-0 right-0 z-[1] hidden md:block" data-parallax="0.08">
			<div class="stamp text-sm lg:text-base">Parket plný</div>
		</div>
		<p class="kicker">{kicker}</p>
		<h1
			class="display mt-3 max-w-4xl break-words text-[clamp(2.6rem,11vw,4.5rem)] text-ink md:max-w-5xl md:pr-44 md:text-[clamp(4rem,7vw,7.5rem)]"
		>
			{title}
		</h1>
		{#if lede}
			<p class="mt-5 max-w-2xl text-base font-light text-ink-soft sm:text-lg md:mt-6 md:text-xl">
				{lede}
			</p>
		{/if}
	</div>
</section>
