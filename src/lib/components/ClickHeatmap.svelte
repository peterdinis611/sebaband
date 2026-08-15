<script lang="ts">
	import {
		clearClicks,
		clickPaths,
		clicksForPath,
		getClicks,
		topClickTargets,
		type ClickSample
	} from '$lib/analytics.svelte';

	let {
		paths = []
	}: {
		paths?: string[];
	} = $props();

	const STAGE_H = 420;
	const MAX_DOTS = 200;

	let samples = $state<ClickSample[]>([]);
	let selected = $state('/');
	let mode = $state<'page' | 'viewport'>('viewport');
	let canvas = $state<HTMLCanvasElement>();

	const pathOptions = $derived.by(() => {
		const recorded = clickPaths(samples).map(([p]) => p);
		return [...new Set([...paths, ...recorded, selected])].sort();
	});

	const filtered = $derived(clicksForPath(selected, samples));
	const tops = $derived(topClickTargets(filtered));
	const paintClicks = $derived(
		filtered.length > MAX_DOTS ? filtered.slice(-MAX_DOTS) : filtered
	);

	function refresh() {
		samples = getClicks();
	}

	function wipe() {
		clearClicks();
		refresh();
	}

	function paint() {
		const el = canvas;
		if (!el) return;
		const ctx = el.getContext('2d');
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		const cssW = Math.max(el.clientWidth || 640, 1);
		const cssH = STAGE_H;
		const w = Math.floor(cssW * dpr);
		const h = Math.floor(cssH * dpr);
		if (el.width !== w || el.height !== h) {
			el.width = w;
			el.height = h;
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, cssW, cssH);

		ctx.fillStyle = '#f3ead8';
		ctx.fillRect(0, 0, cssW, cssH);
		ctx.strokeStyle = 'rgba(23, 18, 14, 0.1)';
		for (let x = 0; x <= cssW; x += 28) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, cssH);
			ctx.stroke();
		}
		for (let y = 0; y <= cssH; y += 28) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(cssW, y);
			ctx.stroke();
		}

		if (!paintClicks.length) {
			ctx.fillStyle = 'rgba(255, 248, 236, 0.95)';
			ctx.fillRect(16, 16, Math.min(cssW - 32, 360), 48);
			ctx.strokeStyle = '#17120e';
			ctx.lineWidth = 2;
			ctx.strokeRect(16, 16, Math.min(cssW - 32, 360), 48);
			ctx.fillStyle = '#17120e';
			ctx.font = '700 14px "Big Shoulders Display", Impact, sans-serif';
			ctx.fillText('Zatiaľ žiadne kliky — prejdi web a vráť sa.', 28, 46);
			return;
		}

		ctx.globalCompositeOperation = 'screen';
		for (const click of paintClicks) {
			const x = ((mode === 'page' ? click.xPct : click.vxPct) / 100) * cssW;
			const y = ((mode === 'page' ? click.yPct : click.vyPct) / 100) * cssH;
			const g = ctx.createRadialGradient(x, y, 0, x, y, 28);
			g.addColorStop(0, 'rgba(255, 106, 69, 0.85)');
			g.addColorStop(0.4, 'rgba(226, 58, 27, 0.4)');
			g.addColorStop(1, 'rgba(226, 58, 27, 0)');
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(x, y, 28, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.globalCompositeOperation = 'source-over';
		for (const click of paintClicks) {
			const x = ((mode === 'page' ? click.xPct : click.vxPct) / 100) * cssW;
			const y = ((mode === 'page' ? click.yPct : click.vyPct) / 100) * cssH;
			ctx.beginPath();
			ctx.arc(x, y, 2.5, 0, Math.PI * 2);
			ctx.fillStyle = '#fff8ec';
			ctx.fill();
			ctx.lineWidth = 1.25;
			ctx.strokeStyle = '#17120e';
			ctx.stroke();
		}
	}

	$effect(() => {
		refresh();
	});

	$effect(() => {
		void paintClicks;
		void mode;
		void selected;
		void canvas;
		const id = requestAnimationFrame(paint);
		return () => cancelAnimationFrame(id);
	});

	$effect(() => {
		const onResize = () => paint();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<div class="heat">
	<div class="heat-toolbar">
		<label class="heat-field">
			<span>Stránka</span>
			<select bind:value={selected} class="heat-select">
				{#each pathOptions as path (path)}
					<option value={path}>{path}</option>
				{/each}
			</select>
		</label>
		<div class="heat-modes" role="group" aria-label="Režim mapy">
			<button type="button" class:is-on={mode === 'viewport'} onclick={() => (mode = 'viewport')}>
				Viewport
			</button>
			<button type="button" class:is-on={mode === 'page'} onclick={() => (mode = 'page')}>
				Celá stránka
			</button>
		</div>
		<button type="button" class="btn-ink !py-2" onclick={wipe}>Vymazať kliky</button>
	</div>

	<p class="heat-meta">
		<strong class="text-paprika">{filtered.length}</strong> klikov na
		<code>{selected}</code>
		{#if filtered.length > MAX_DOTS}
			· mapujem posledných {MAX_DOTS}
		{/if}
	</p>

	<div class="heat-stage" style="height: {STAGE_H}px">
		<canvas
			bind:this={canvas}
			class="heat-canvas"
			style="height: {STAGE_H}px"
			aria-label="Heatmapa klikov"
		></canvas>
		<div class="heat-legend" aria-hidden="true">
			<span>Málo</span>
			<i></i>
			<span>Veľa</span>
		</div>
	</div>

	{#if tops.length}
		<div class="heat-tops">
			<p class="kicker">Top ciele</p>
			<ul>
				{#each tops as row (row.tag + row.label)}
					<li>
						<span class="heat-tag">{row.tag}</span>
						<span class="heat-label">{row.label || '—'}</span>
						<span class="heat-count">{row.count}×</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.heat {
		display: grid;
		gap: 1rem;
	}

	.heat-toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		gap: 0.75rem 1rem;
	}

	.heat-field {
		display: grid;
		gap: 0.35rem;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-dust);
	}

	.heat-select {
		min-width: 12rem;
		border: 2px solid var(--color-ink);
		background: var(--color-cream);
		padding: 0.55rem 0.7rem;
		font-family: var(--font-display);
		font-weight: 800;
		color: var(--color-ink);
	}

	.heat-modes {
		display: inline-flex;
		border: 2px solid var(--color-ink);
		background: var(--color-cream);
	}

	.heat-modes button {
		border: 0;
		background: transparent;
		padding: 0.55rem 0.85rem;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-ink);
		cursor: pointer;
	}

	.heat-modes button.is-on {
		background: var(--color-paprika);
		color: var(--color-foam);
	}

	.heat-meta {
		margin: 0;
		font-size: 0.95rem;
		color: var(--color-ink-soft);
	}

	.heat-meta code {
		font-family: var(--font-display);
		font-weight: 800;
		color: var(--color-ink);
	}

	.heat-stage {
		position: relative;
		border: 2px solid var(--color-ink);
		box-shadow: 8px 8px 0 var(--color-punch);
		background: var(--color-paper-2);
		overflow: hidden;
	}

	.heat-canvas {
		display: block;
		width: 100%;
	}

	.heat-legend {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.55rem;
		border: 2px solid var(--color-ink);
		background: var(--color-cream);
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.heat-legend i {
		display: block;
		width: 4.5rem;
		height: 0.55rem;
		background: linear-gradient(90deg, rgba(226, 58, 27, 0.15), #e23a1b);
	}

	.heat-tops ul {
		margin: 0.85rem 0 0;
		padding: 0;
		list-style: none;
		border: 2px solid var(--color-ink);
		background: var(--color-cream);
	}

	.heat-tops li {
		display: grid;
		grid-template-columns: 4.5rem 1fr auto;
		gap: 0.75rem;
		align-items: baseline;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 20%, transparent);
	}

	.heat-tops li:last-child {
		border-bottom: 0;
	}

	.heat-tag {
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-dust);
	}

	.heat-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.heat-count {
		font-family: var(--font-display);
		font-weight: 900;
		color: var(--color-paprika);
	}
</style>
