import {
	animate,
	createScope,
	createTimeline,
	onScroll,
	set,
	stagger
} from 'animejs';
import { boot } from '$lib/boot.svelte';

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function showNow(els: Iterable<Element>) {
	for (const el of els) (el as HTMLElement).style.opacity = '1';
}

export function playLanding(root: HTMLElement): () => void {
	if (prefersReducedMotion()) {
		showNow(root.querySelectorAll('.js-hero, .js-await, .js-stat'));
		return () => {};
	}

	const hero = root.querySelector<HTMLElement>('.js-hero');
	const stats = [...root.querySelectorAll<HTMLElement>('.js-stat')];
	const img = root.querySelector<HTMLImageElement>('.js-hero-photo img');

	let started = false;
	let timer = 0;
	const cleanups: Array<() => void> = [];

	const start = () => {
		if (started) return;
		started = true;
		window.clearTimeout(timer);

		if (hero) {
			animate(hero, {
				opacity: [0, 1],
				y: [18, 0],
				duration: 520,
				ease: 'outExpo'
			});
		} else {
			showNow(root.querySelectorAll('.js-await'));
		}

		if (stats.length) {
			animate(stats, {
				opacity: [0, 1],
				y: [12, 0],
				duration: 420,
				delay: stagger(40),
				ease: 'outExpo'
			});
		}
	};

	// Reveal only after hero bitmap is ready (or short failsafe) — no lone title over empty photo.
	if (img && !img.complete) {
		const onReady = () => start();
		img.addEventListener('load', onReady, { once: true });
		img.addEventListener('error', onReady, { once: true });
		cleanups.push(() => {
			img.removeEventListener('load', onReady);
			img.removeEventListener('error', onReady);
		});
		timer = window.setTimeout(start, 480);
	} else if (img?.decode) {
		void img.decode().then(start).catch(start);
		timer = window.setTimeout(start, 480);
	} else {
		start();
	}

	return () => {
		window.clearTimeout(timer);
		cleanups.forEach((fn) => fn());
		showNow(root.querySelectorAll('.js-hero, .js-await, .js-stat'));
	};
}

export function bindScrollIns(root: ParentNode = document): () => void {
	if (prefersReducedMotion()) {
		showNow(root.querySelectorAll('[data-in], [data-in-stagger] > *, .js-gallery > *'));
		return () => {};
	}

	const nodes = [...root.querySelectorAll<HTMLElement>('[data-in]')];
	const groups = [...root.querySelectorAll<HTMLElement>('[data-in-stagger]')];
	if (!nodes.length && !groups.length) return () => {};

	const observers: Array<{ revert: () => void }> = [];

	for (const el of nodes) {
		const delay = Number(el.dataset.inDelay ?? 0);
		const y = Number(el.dataset.inY ?? 36);
		const anim = animate(el, {
			opacity: [0, 1],
			y: [y, 0],
			duration: 920,
			delay,
			ease: 'outExpo',
			autoplay: onScroll({
				target: el,
				repeat: false,
				enter: 'bottom-=12% top'
			})
		});
		observers.push(anim);
	}

	for (const group of groups) {
		const kids = [...group.children] as HTMLElement[];
		if (!kids.length) continue;
		const anim = animate(kids, {
			opacity: [0, 1],
			y: [28, 0],
			duration: 780,
			delay: stagger(90),
			ease: 'outExpo',
			autoplay: onScroll({
				target: group,
				repeat: false,
				enter: 'bottom-=10% top'
			})
		});
		observers.push(anim);
	}

	return () => observers.forEach((o) => o.revert());
}

export function bindPunches(root: ParentNode = document): () => void {
	if (prefersReducedMotion()) return () => {};

	const buttons = [
		...root.querySelectorAll<HTMLElement>(
			'.btn-hot, .btn-ink, .contact-card, [data-punch]'
		)
	];
	const cleanups: Array<() => void> = [];

	for (const el of buttons) {
		if (el.classList.contains('theme-toggle')) continue;
		const enter = () => {
			animate(el, {
				scale: el.classList.contains('contact-card') ? 1.02 : 1.045,
				y: -4,
				rotate: el.classList.contains('contact-card') ? -0.4 : -0.7,
				duration: 280,
				ease: 'outQuad',
				composition: 'replace'
			});
		};
		const leave = () => {
			animate(el, {
				scale: 1,
				y: 0,
				rotate: 0,
				duration: 380,
				ease: 'outExpo',
				composition: 'replace'
			});
		};
		el.addEventListener('pointerenter', enter);
		el.addEventListener('pointerleave', leave);
		cleanups.push(() => {
			el.removeEventListener('pointerenter', enter);
			el.removeEventListener('pointerleave', leave);
		});
	}

	return () => cleanups.forEach((fn) => fn());
}

export function playHeader(el: HTMLElement): () => void {
	if (prefersReducedMotion()) return () => {};

	const scope = createScope({ root: el }).add(() => {
		animate(el, {
			y: [-8, 0],
			duration: 380,
			ease: 'outExpo'
		});
	});

	return () => scope.revert();
}

export function playPageHero(el: HTMLElement): () => void {
	if (prefersReducedMotion()) {
		showNow(el.querySelectorAll('.js-await'));
		return () => {};
	}

	const title = el.querySelector('h1');
	const kicker = el.querySelector('.kicker');
	const lede = el.querySelector('p:not(.kicker)');

	const tl = createTimeline({ defaults: { ease: 'outExpo' } });
	if (kicker) tl.add(kicker, { opacity: [0, 1], y: [10, 0], duration: 380 }, 0);
	if (title) tl.add(title, { opacity: [0, 1], y: [16, 0], duration: 460 }, 30);
	if (lede) tl.add(lede, { opacity: [0, 1], y: [12, 0], duration: 400 }, 120);
	const stamp = el.querySelector('.stamp');
	if (stamp) {
		set(stamp, { opacity: 0, scale: 1.3, rotate: -18 });
		tl.add(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 380 }, 180);
	}

	return () => tl.revert();
}

export function playGallery(el: HTMLElement): () => void {
	const kids = [...el.children] as HTMLElement[];
	if (!kids.length) return () => {};
	if (prefersReducedMotion()) {
		showNow(kids);
		return () => {};
	}
	const anim = animate(kids, {
		opacity: [0, 1],
		y: [40, 0],
		scale: [0.94, 1],
		duration: 860,
		delay: stagger(80),
		ease: 'outExpo',
		autoplay: onScroll({
			target: el,
			repeat: false,
			enter: 'bottom-=8% top'
		})
	});
	return () => anim.revert();
}

export type PageTurnOpts = {
	direction: 1 | -1;
	label: string;
};

function turnOffX(direction: 1 | -1) {
	return direction > 0 ? '108vw' : '-108vw';
}

function turnExitX(direction: 1 | -1) {
	return direction > 0 ? '-108vw' : '108vw';
}

export async function coverPageTurn(root: HTMLElement, opts: PageTurnOpts): Promise<void> {
	const sheet = root.querySelector<HTMLElement>('.js-turn-sheet');
	const ink = root.querySelector<HTMLElement>('.js-turn-ink');
	const type = root.querySelector<HTMLElement>('.js-turn-type');
	const kicker = root.querySelector<HTMLElement>('.js-turn-kicker');
	const stamp = root.querySelector<HTMLElement>('.js-turn-stamp');
	if (!sheet) return;

	if (type) type.textContent = opts.label;
	root.dataset.on = '1';
	document.documentElement.classList.add('is-turning');

	const from = turnOffX(opts.direction);
	const tilt = opts.direction > 0 ? 2.4 : -2.4;
	set(sheet, { x: from, rotate: tilt });
	if (ink) set(ink, { x: from });
	if (kicker) set(kicker, { opacity: 0, y: 16 });
	if (type) set(type, { opacity: 0, y: 36, scale: 1.08 });
	if (stamp) set(stamp, { opacity: 0, scale: 1.35, rotate: -22 });

	const tl = createTimeline({ defaults: { ease: 'outExpo' } });
	if (ink) tl.add(ink, { x: '0vw', duration: 420 }, 0);
	tl.add(sheet, { x: '0vw', rotate: -0.8, duration: 480 }, 70);
	if (kicker) tl.add(kicker, { opacity: 1, y: 0, duration: 280 }, 240);
	if (type) tl.add(type, { opacity: 1, y: 0, scale: 1, duration: 420 }, 280);
	if (stamp) tl.add(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 360 }, 340);
	await tl;
}

export async function revealPageTurn(root: HTMLElement, opts: Pick<PageTurnOpts, 'direction'>): Promise<void> {
	const sheet = root.querySelector<HTMLElement>('.js-turn-sheet');
	const ink = root.querySelector<HTMLElement>('.js-turn-ink');
	if (!sheet) {
		root.dataset.on = '0';
		document.documentElement.classList.remove('is-turning');
		return;
	}

	const to = turnExitX(opts.direction);
	const tilt = opts.direction > 0 ? -3 : 3;
	const tl = createTimeline({ defaults: { ease: 'inOutExpo' } });
	tl.add(sheet, { x: to, rotate: tilt, duration: 520 }, 0);
	if (ink) tl.add(ink, { x: to, duration: 560 }, 40);
	try {
		await tl;
	} finally {
		root.dataset.on = '0';
		document.documentElement.classList.remove('is-turning');
		set(sheet, { x: 0, rotate: 0 });
		if (ink) set(ink, { x: 0 });
	}
}

function sleep(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Soft-preload hero; never block boot longer than `budgetMs`. */
function warmHeroImage(budgetMs = 280): Promise<void> {
	return Promise.race([
		new Promise<void>((resolve) => {
			const img = new Image();
			const done = () => resolve();
			img.onload = done;
			img.onerror = done;
			img.decoding = 'async';
			img.src = '/images/hero-band.webp';
			if (typeof img.decode === 'function') {
				img.decode().then(done).catch(done);
			}
		}),
		sleep(budgetMs)
	]);
}

export async function playBoot(root: HTMLElement): Promise<void> {
	if (prefersReducedMotion()) {
		document.documentElement.classList.remove('is-booting');
		boot.locked = false;
		root.remove();
		return;
	}

	const title = root.querySelector('.js-boot-title');
	const kicker = root.querySelector('.js-boot-kicker');
	const stamp = root.querySelector('.js-boot-stamp');
	const bar = root.querySelector<HTMLElement>('.js-boot-bar');
	const pct = root.querySelector<HTMLElement>('.js-boot-pct');

	if (kicker) set(kicker, { opacity: 0, y: 10 });
	if (title) set(title, { opacity: 0, y: 18 });
	if (stamp) set(stamp, { opacity: 0, scale: 1.25, rotate: -18 });
	if (bar) {
		bar.style.animation = 'none';
		set(bar, { scaleX: 0.12 });
	}

	const intro = createTimeline({ defaults: { ease: 'outExpo' } });
	if (kicker) intro.add(kicker, { opacity: 1, y: 0, duration: 280 }, 0);
	if (title) intro.add(title, { opacity: 1, y: 0, duration: 420 }, 40);
	if (stamp) intro.add(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 320 }, 160);

	if (bar) {
		animate(bar, {
			scaleX: 0.9,
			duration: 520,
			ease: 'inOutQuad',
			onRender: (self) => {
				if (pct) pct.textContent = String(Math.max(12, Math.round(self.progress * 90)));
			}
		});
	}

	// Warm hero bitmap under the curtain so landing isn't empty when it lifts.
	await Promise.race([Promise.all([warmHeroImage(520), sleep(360)]), sleep(1000)]);

	if (bar) {
		await animate(bar, {
			scaleX: 1,
			duration: 160,
			ease: 'outExpo',
			onRender: () => {
				if (pct) pct.textContent = '100';
			}
		});
	} else if (pct) pct.textContent = '100';

	// Unlock page so hero can animate under the sliding curtain.
	document.documentElement.classList.remove('is-booting');
	boot.locked = false;

	await animate(root, { y: '-110%', duration: 420, ease: 'inOutExpo' });
	root.remove();
}

export function playPop(el: HTMLElement): () => void {
	if (prefersReducedMotion()) return () => {};
	set(el, { scale: 0.55, opacity: 0, rotate: -12 });
	const anim = animate(el, {
		scale: 1,
		opacity: 1,
		rotate: 0,
		duration: 420,
		ease: 'outExpo'
	});
	return () => anim.revert();
}

export function playMobileNav(el: HTMLElement): () => void {
	if (prefersReducedMotion()) return () => {};
	const links = el.querySelectorAll('a');
	if (!links.length) return () => {};
	set(links, { opacity: 0, x: -28 });
	const anim = animate(links, {
		opacity: 1,
		x: 0,
		delay: stagger(55),
		duration: 460,
		ease: 'outExpo'
	});
	return () => anim.revert();
}

export function playCalendarDays(grid: HTMLElement): () => void {
	const days = [...grid.querySelectorAll<HTMLElement>('button')];
	if (!days.length) return () => {};
	if (prefersReducedMotion()) {
		showNow(days);
		return () => {};
	}
	set(days, { opacity: 0, scale: 0.72 });
	const anim = animate(days, {
		opacity: 1,
		scale: 1,
		delay: stagger(14, { grid: [7, Math.ceil(days.length / 7)], from: 'first' }),
		duration: 380,
		ease: 'outExpo'
	});
	return () => anim.revert();
}

export function pulsePick(el: HTMLElement) {
	if (prefersReducedMotion()) return;
	animate(el, {
		scale: [1, 1.14, 1],
		duration: 380,
		ease: 'outExpo',
		composition: 'replace'
	});
}

export async function playThemeWipe(
	origin: HTMLElement,
	next: 'light' | 'dark',
	onCovered: () => void
): Promise<void> {
	const wipe = document.querySelector<HTMLElement>('.theme-wipe');
	if (!wipe || prefersReducedMotion()) {
		onCovered();
		return;
	}

	const icon = origin.querySelector('svg');
	if (icon) {
		animate(icon, {
			rotate: next === 'dark' ? 180 : -180,
			scale: [1, 0.55, 1],
			duration: 560,
			ease: 'outExpo',
			composition: 'replace'
		});
	}

	const rect = origin.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
	const span = Math.hypot(window.innerWidth, window.innerHeight) * 2.15;
	wipe.style.left = `${x - 14}px`;
	wipe.style.top = `${y - 14}px`;
	wipe.style.background = next === 'dark' ? '#0c0b0a' : '#f3ead8';
	wipe.style.opacity = '1';
	set(wipe, { scale: 0 });
	await animate(wipe, {
		scale: span / 28,
		duration: 620,
		ease: 'inOutExpo'
	});
	onCovered();
	await animate(wipe, { opacity: 0, duration: 280, ease: 'outQuad' });
	set(wipe, { scale: 0 });
}
