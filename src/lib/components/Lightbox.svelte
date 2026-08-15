<script lang="ts">
	import { animate, set } from 'animejs';
	import Icon from '$lib/components/Icon.svelte';
	import SmartImage from '$lib/components/SmartImage.svelte';
	import type { GalleryItem } from '$lib/data/gallery';
	import { prefersReducedMotion } from '$lib/motion';
	import { portal } from '$lib/portal';

	let {
		items,
		index = $bindable(0),
		open = $bindable(false)
	}: {
		items: GalleryItem[];
		index?: number;
		open: boolean;
	} = $props();

	let overlay = $state<HTMLDivElement>();
	let frame = $state<HTMLElement>();
	let photo = $state<HTMLElement>();
	let seen = $state(false);

	const current = $derived(items[index] ?? items[0]);
	const total = $derived(items.length);
	const label = $derived(String(index + 1).padStart(2, '0'));
	const count = $derived(String(total).padStart(2, '0'));

	function close() {
		open = false;
	}

	function prev() {
		if (total < 2) return;
		index = (index - 1 + total) % total;
	}

	function next() {
		if (total < 2) return;
		index = (index + 1) % total;
	}

	$effect(() => {
		document.documentElement.classList.toggle('lb-open', open);
		return () => document.documentElement.classList.remove('lb-open');
	});

	$effect(() => {
		if (!open || !overlay) return;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				close();
			}
			if (e.key === 'ArrowLeft') prev();
			if (e.key === 'ArrowRight') next();
		};

		window.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';
		overlay.focus({ preventScroll: true });

		if (!prefersReducedMotion() && frame) {
			set(overlay, { opacity: 0 });
			set(frame, { scale: 0.92, y: 24, rotate: -0.8 });
			animate(overlay, { opacity: 1, duration: 220, ease: 'outQuad' });
			animate(frame, { scale: 1, y: 0, rotate: 0, duration: 420, ease: 'outExpo' });
		}

		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		void index;
		if (!open) {
			seen = false;
			return;
		}
		if (!seen) {
			seen = true;
			return;
		}
		if (!photo || prefersReducedMotion()) return;
		set(photo, { opacity: 0.25, y: 10 });
		animate(photo, { opacity: 1, y: 0, duration: 280, ease: 'outQuad' });
	});

	let touchX = 0;

	function onTouchStart(e: TouchEvent) {
		touchX = e.changedTouches[0]?.clientX ?? 0;
	}

	function onTouchEnd(e: TouchEvent) {
		const target = e.target as HTMLElement | null;
		if (target?.closest('button')) return;
		const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX;
		if (dx > 56) prev();
		if (dx < -56) next();
	}
</script>

{#if open && current}
	<div
		bind:this={overlay}
		use:portal
		class="lb"
		role="dialog"
		aria-modal="true"
		aria-label={current.alt}
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
		ontouchstart={onTouchStart}
		ontouchend={onTouchEnd}
	>
		<button
			type="button"
			class="lb-close"
			onclick={(e) => {
				e.stopPropagation();
				close();
			}}
			aria-label="Zavrieť"
		>
			<Icon name="close" size={22} />
			<span>Zavrieť</span>
		</button>

		{#if total > 1}
			<button
				type="button"
				class="lb-nav lb-prev"
				onclick={(e) => {
					e.stopPropagation();
					prev();
				}}
				aria-label="Predchádzajúca"
			>
				<Icon name="prev" size={26} />
			</button>
			<button
				type="button"
				class="lb-nav lb-next"
				onclick={(e) => {
					e.stopPropagation();
					next();
				}}
				aria-label="Ďalšia"
			>
				<Icon name="next" size={26} />
			</button>
		{/if}

		<div class="lb-stage" role="presentation" onclick={(e) => e.stopPropagation()}>
			<figure bind:this={frame} class="lb-frame">
				<div bind:this={photo} class="lb-photo">
					<SmartImage
						src={current.src}
						alt={current.alt}
						width={current.width}
						height={current.height}
						priority
						sizes="92vw"
						imgClass="lb-img"
					/>
				</div>
				<figcaption class="lb-cap">
					<span class="lb-kicker">{label} / {count}</span>
					<p>{current.alt}</p>
				</figcaption>
			</figure>
		</div>
	</div>
{/if}

<style>
	.lb {
		position: fixed;
		inset: 0;
		z-index: 400;
		display: grid;
		place-items: center;
		padding: 4.5rem 1rem 1.25rem;
		background: var(--color-scrim);
		outline: none;
		pointer-events: auto;
		isolation: isolate;
	}

	.lb-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 5;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		border: 2px solid var(--color-ink);
		background: var(--color-paprika);
		color: var(--color-foam);
		padding: 0.55rem 0.95rem;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.95rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		box-shadow: 4px 4px 0 var(--color-punch);
		pointer-events: auto;
		cursor: pointer;
	}

	.lb-nav {
		position: absolute;
		top: 50%;
		z-index: 5;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		transform: translateY(-50%);
		border: 2px solid var(--color-ink);
		background: var(--color-cream);
		color: var(--color-ink);
		box-shadow: 4px 4px 0 var(--color-punch);
		pointer-events: auto;
		cursor: pointer;
	}

	.lb-prev {
		left: 0.75rem;
	}

	.lb-next {
		right: 0.75rem;
	}

	.lb-stage {
		position: relative;
		z-index: 1;
		max-width: 100%;
	}

	.lb-frame {
		position: relative;
		margin: 0;
		width: min(92vw, 1080px);
		max-height: calc(100dvh - 5.75rem);
		display: grid;
		grid-template-rows: 1fr auto;
		background: var(--color-cream);
		border: 2px solid var(--color-ink);
		box-shadow: 10px 10px 0 var(--color-punch);
		padding: 0.7rem 0.7rem 0;
		pointer-events: auto;
	}

	.lb-photo {
		min-height: 0;
		overflow: hidden;
		background: var(--color-paper-2);
		border: 2px solid var(--color-ink);
	}

	.lb-photo :global(picture) {
		display: block;
		height: 100%;
	}

	.lb-photo :global(.lb-img) {
		display: block;
		width: 100%;
		height: 100%;
		max-height: calc(100dvh - 11.5rem);
		object-fit: contain;
		background: var(--color-paper-2);
	}

	.lb-cap {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 0.15rem 0.85rem;
	}

	.lb-kicker {
		flex-shrink: 0;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.15rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-paprika);
	}

	.lb-cap p {
		margin: 0;
		text-align: right;
		font-size: 0.92rem;
		color: var(--color-ink-soft);
	}

	@media (max-width: 720px) {
		.lb {
			padding: 4.25rem 0.65rem 0.85rem;
		}

		.lb-nav {
			top: auto;
			bottom: 5.4rem;
			transform: none;
			width: 2.6rem;
			height: 2.6rem;
		}

		.lb-cap {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.2rem;
		}

		.lb-cap p {
			text-align: left;
		}

		.lb-close span {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lb,
		.lb-frame,
		.lb-photo {
			transition: none;
		}
	}
</style>
