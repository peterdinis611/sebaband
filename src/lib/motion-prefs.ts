/** Media-query helpers only — safe on the critical path (no anime.js). */

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Narrow / touch UIs skip heavy motion (parallax, page curtain, blur). */
export function prefersLightMotion(): boolean {
	return (
		prefersReducedMotion() ||
		window.matchMedia('(max-width: 767px)').matches ||
		window.matchMedia('(hover: none), (pointer: coarse)').matches
	);
}

/** Defer work until after first paint / idle — keeps anime.js off LCP. */
export function afterPaint(fn: () => void, timeout = 1400): () => void {
	let idleId = 0;
	let timer = 0;
	let cancelled = false;

	const run = () => {
		if (cancelled) return;
		fn();
	};

	const schedule = () => {
		if (cancelled) return;
		if (typeof requestIdleCallback === 'function') {
			idleId = requestIdleCallback(run, { timeout: Math.min(timeout, 2000) });
		} else {
			timer = window.setTimeout(run, 180);
		}
	};

	if (typeof requestAnimationFrame === 'function') {
		requestAnimationFrame(() => requestAnimationFrame(schedule));
	} else {
		schedule();
	}

	return () => {
		cancelled = true;
		if (idleId && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId);
		if (timer) window.clearTimeout(timer);
	};
}
