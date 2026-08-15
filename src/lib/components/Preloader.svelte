<script lang="ts">
	import { navigating } from '$app/state';
	import { boot } from '$lib/boot.svelte';
	import { playBoot, prefersReducedMotion } from '$lib/motion';

	let barOn = $state(false);
	let barDone = $state(false);

	$effect(() => {
		const el = document.getElementById('boot');
		if (!el) {
			boot.locked = false;
			document.documentElement.classList.remove('is-booting');
			return;
		}
		if (prefersReducedMotion()) {
			el.remove();
			boot.locked = false;
			document.documentElement.classList.remove('is-booting');
			return;
		}

		boot.locked = true;
		let dead = false;
		const failsafe = window.setTimeout(() => {
			if (dead) return;
			document.getElementById('boot')?.remove();
			document.documentElement.classList.remove('is-booting');
			boot.locked = false;
		}, 1400);
		void playBoot(el).finally(() => {
			window.clearTimeout(failsafe);
			if (!dead) boot.locked = false;
		});
		return () => {
			dead = true;
			window.clearTimeout(failsafe);
		};
	});

	$effect(() => {
		if (navigating.type) {
			barOn = true;
			barDone = false;
			return;
		}
		if (!barOn) return;
		barDone = true;
		const id = window.setTimeout(() => {
			barOn = false;
			barDone = false;
		}, 320);
		return () => window.clearTimeout(id);
	});
</script>

<div
	class="nav-progress"
	class:is-on={barOn}
	class:is-done={barDone}
	aria-hidden="true"
></div>
