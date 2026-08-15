<script lang="ts">
	import { navigating, page } from '$app/state';
	import { boot } from '$lib/boot.svelte';
	import { playBoot, prefersReducedMotion } from '$lib/motion';

	let barOn = $state(false);
	let barDone = $state(false);
	let started = false;

	function forceUnlock() {
		document.getElementById('boot')?.remove();
		document.documentElement.classList.remove('is-booting');
		boot.locked = false;
		try {
			sessionStorage.setItem('seba-booted', '1');
		} catch {
			/* ignore */
		}
	}

	function shouldSkipBoot() {
		if (typeof window === 'undefined') return true;
		if (prefersReducedMotion()) return true;
		if (page.url.pathname.startsWith('/analytics')) return true;
		if (page.url.searchParams.get('preview') === '1') return true;
		try {
			if (sessionStorage.getItem('seba-booted') === '1') return true;
		} catch {
			/* ignore */
		}
		return false;
	}

	$effect(() => {
		if (started) return;
		started = true;

		const el = document.getElementById('boot');
		if (!el || shouldSkipBoot()) {
			forceUnlock();
			return;
		}

		boot.locked = true;
		const hard = window.setTimeout(forceUnlock, 1600);
		void playBoot(el)
			.catch(() => forceUnlock())
			.finally(() => {
				window.clearTimeout(hard);
				forceUnlock();
			});
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
