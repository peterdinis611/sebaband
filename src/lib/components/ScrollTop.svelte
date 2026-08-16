<script lang="ts">
	import { prefersReducedMotion } from '$lib/motion-prefs';
	import Icon from '$lib/components/Icon.svelte';

	let visible = $state(false);

	$effect(() => {
		const onScroll = () => {
			visible = window.scrollY > 200;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function up() {
		window.scrollTo({
			top: 0,
			behavior: prefersReducedMotion() ? 'auto' : 'smooth'
		});
	}
</script>

<button
	type="button"
	class="scroll-top"
	class:is-on={visible}
	onclick={up}
	aria-label="Späť nahor"
	tabindex={visible ? 0 : -1}
>
	<Icon name="up" size={22} />
</button>
