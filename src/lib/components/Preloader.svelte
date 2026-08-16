<script lang="ts">
	import { navigating } from '$app/state';

	let barOn = $state(false);
	let barDone = $state(false);

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
