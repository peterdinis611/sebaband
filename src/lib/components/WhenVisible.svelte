<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		rootMargin = '280px 0px',
		minHeight = '0px'
	}: {
		children: Snippet;
		rootMargin?: string;
		minHeight?: string;
	} = $props();

	let host = $state<HTMLElement>();
	let visible = $state(false);

	$effect(() => {
		if (!host || visible) return;
		if (typeof IntersectionObserver === 'undefined') {
			visible = true;
			return;
		}

		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					visible = true;
					io.disconnect();
				}
			},
			{ rootMargin }
		);
		io.observe(host);
		return () => io.disconnect();
	});
</script>

<div bind:this={host} style:min-height={visible ? undefined : minHeight}>
	{#if visible}
		{@render children()}
	{/if}
</div>
