import {
	animate,
	createScope,
	createTimeline,
	onScroll,
	set,
	stagger
} from 'animejs';
import { prefersLightMotion, prefersReducedMotion } from '$lib/motion-prefs';

export { prefersLightMotion, prefersReducedMotion } from '$lib/motion-prefs';

function showNow(els: Iterable<Element>) {
	for (const el of els) (el as HTMLElement).style.opacity = '1';
}

export function playLanding(root: HTMLElement): () => void {
	// Hero stays painted for LCP — only soft transform polish after paint.
	if (prefersReducedMotion()) return () => {};

	const hero = root.querySelector<HTMLElement>('.js-hero');
	const stats = [...root.querySelectorAll<HTMLElement>('.js-stat')];
	const light = prefersLightMotion();

	if (hero && !light) {
		const copy = hero.querySelector('.js-hero-copy');
		const photo = hero.querySelector('.js-hero-photo');
		if (copy) {
			animate(copy, {
				y: [14, 0],
				duration: 480,
				ease: 'outQuart'
			});
		}
		if (photo) {
			animate(photo, {
				y: [18, 0],
				scale: [1.025, 1],
				duration: 560,
				delay: 40,
				ease: 'outQuart'
			});
		}
	}

	if (stats.length && !light) {
		animate(stats, {
			y: [8, 0],
			duration: 360,
			delay: stagger(36),
			ease: 'outExpo'
		});
	}

	return () => {};
}

export function bindScrollIns(root: ParentNode = document): () => void {
	if (prefersReducedMotion()) {
		showNow(root.querySelectorAll('[data-in], [data-in-stagger] > *, .js-gallery > *'));
		return () => {};
	}

	const nodes = [...root.querySelectorAll<HTMLElement>('[data-in]')];
	const groups = [...root.querySelectorAll<HTMLElement>('[data-in-stagger]')];
	if (!nodes.length && !groups.length) return () => {};

	const light = prefersLightMotion();
	const observers: Array<{ revert: () => void }> = [];

	for (const el of nodes) {
		const delay = Number(el.dataset.inDelay ?? 0);
		const y = Number(el.dataset.inY ?? (light ? 22 : 42));
		const anim = animate(el, {
			opacity: [0, 1],
			y: [y, 0],
			rotate: light ? [0, 0] : [0.8, 0],
			...(light ? {} : { filter: ['blur(4px)', 'blur(0px)'] }),
			duration: light ? 520 : 820,
			delay,
			ease: 'outQuart',
			autoplay: onScroll({
				target: el,
				repeat: false,
				enter: 'bottom-=14% top'
			})
		});
		observers.push(anim);
	}

	for (const group of groups) {
		const kids = [...group.children] as HTMLElement[];
		if (!kids.length) continue;
		const anim = animate(kids, {
			opacity: [0, 1],
			y: [light ? 18 : 32, 0],
			rotate: light ? [0, 0] : [0.6, 0],
			duration: light ? 480 : 700,
			delay: stagger(light ? 40 : 70),
			ease: 'outQuart',
			autoplay: onScroll({
				target: group,
				repeat: false,
				enter: 'bottom-=12% top'
			})
		});
		observers.push(anim);
	}

	return () => observers.forEach((o) => o.revert());
}

/** Scroll parallax for `[data-parallax="0.15"]` (speed factor). */
export function bindParallax(root: ParentNode = document): () => void {
	if (prefersLightMotion()) return () => {};

	const nodes = [...root.querySelectorAll<HTMLElement>('[data-parallax]')];
	if (!nodes.length) return () => {};

	for (const el of nodes) {
		el.classList.add('is-parallax');
	}

	let raf = 0;
	const tick = () => {
		raf = 0;
		const mid = window.innerHeight * 0.5;
		for (const el of nodes) {
			const speed = Number(el.dataset.parallax ?? 0.14);
			if (!Number.isFinite(speed) || speed === 0) continue;
			const rect = el.getBoundingClientRect();
			const center = rect.top + rect.height * 0.5;
			const offset = (center - mid) * -speed;
			el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
		}
	};

	const onScroll = () => {
		if (!raf) raf = requestAnimationFrame(tick);
	};

	tick();
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });

	return () => {
		cancelAnimationFrame(raf);
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
		for (const el of nodes) {
			el.style.transform = '';
			el.classList.remove('is-parallax');
		}
	};
}

export function bindPunches(root: ParentNode = document): () => void {
	if (prefersLightMotion()) return () => {};

	const buttons = [
		...root.querySelectorAll<HTMLElement>(
			'.btn-hot, .btn-ink, .btn-on-dark, .btn-on-dark-fill, .contact-card, [data-punch]'
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
	// Titles stay visible for LCP — transform-only polish.
	if (prefersReducedMotion() || prefersLightMotion()) return () => {};

	const title = el.querySelector('h1');
	const kicker = el.querySelector('.kicker');
	const lede = el.querySelector('p:not(.kicker)');

	const tl = createTimeline({ defaults: { ease: 'outQuart' } });
	if (kicker) tl.add(kicker, { y: [10, 0], duration: 360 }, 0);
	if (title) tl.add(title, { y: [14, 0], duration: 480 }, 40);
	if (lede) tl.add(lede, { y: [10, 0], duration: 400 }, 100);
	const stamp = el.querySelector('.stamp');
	if (stamp) {
		tl.add(stamp, { scale: [1.12, 1], rotate: [-14, -8], duration: 380 }, 140);
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
	const slash = root.querySelector<HTMLElement>('.js-turn-slash');
	const type = root.querySelector<HTMLElement>('.js-turn-type');
	const kicker = root.querySelector<HTMLElement>('.js-turn-kicker');
	const stamp = root.querySelector<HTMLElement>('.js-turn-stamp');
	if (!sheet) return;

	if (type) type.textContent = opts.label;
	root.dataset.on = '1';
	document.documentElement.classList.add('is-turning');

	const from = turnOffX(opts.direction);
	const tilt = opts.direction > 0 ? 3.2 : -3.2;
	set(sheet, { x: from, rotate: tilt, opacity: 1 });
	if (ink) set(ink, { x: from });
	if (slash) set(slash, { x: from, scaleX: 0.4 });
	if (kicker) set(kicker, { opacity: 0, y: 20, letterSpacing: '0.5em' });
	if (type) set(type, { opacity: 0, y: 48, scale: 1.12, rotate: tilt * 0.4 });
	if (stamp) set(stamp, { opacity: 0, scale: 1.55, rotate: -28 });

	const tl = createTimeline({ defaults: { ease: 'outQuart' } });
	if (slash) tl.add(slash, { x: '0vw', scaleX: 1, duration: 320 }, 0);
	if (ink) tl.add(ink, { x: '0vw', duration: 400 }, 40);
	tl.add(sheet, { x: '0vw', rotate: -0.5, duration: 460 }, 80);
	if (kicker) {
		tl.add(kicker, { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 320 }, 220);
	}
	if (type) tl.add(type, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 460 }, 250);
	if (stamp) tl.add(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 380 }, 320);
	await tl;
}

export async function revealPageTurn(root: HTMLElement, opts: Pick<PageTurnOpts, 'direction'>): Promise<void> {
	const sheet = root.querySelector<HTMLElement>('.js-turn-sheet');
	const ink = root.querySelector<HTMLElement>('.js-turn-ink');
	const slash = root.querySelector<HTMLElement>('.js-turn-slash');
	if (!sheet) {
		root.dataset.on = '0';
		document.documentElement.classList.remove('is-turning');
		return;
	}

	const to = turnExitX(opts.direction);
	const tilt = opts.direction > 0 ? -2.6 : 2.6;
	const tl = createTimeline({ defaults: { ease: 'inOutCubic' } });
	tl.add(sheet, { x: to, rotate: tilt, duration: 420 }, 0);
	if (ink) tl.add(ink, { x: to, duration: 460 }, 30);
	if (slash) tl.add(slash, { x: to, duration: 380 }, 60);
	try {
		await tl;
	} finally {
		root.dataset.on = '0';
		document.documentElement.classList.remove('is-turning');
		set(sheet, { x: 0, rotate: 0 });
		if (ink) set(ink, { x: 0 });
		if (slash) set(slash, { x: 0, scaleX: 1 });
	}
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

	const compact = window.matchMedia('(max-width: 639px)').matches;
	set(days, { opacity: 0, scale: compact ? 0.9 : 0.72 });
	const anim = animate(days, {
		opacity: 1,
		scale: 1,
		delay: stagger(compact ? 6 : 14, { grid: [7, Math.ceil(days.length / 7)], from: 'first' }),
		duration: compact ? 260 : 380,
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
			rotate: next === 'dark' ? 120 : -120,
			scale: [1, 0.7, 1],
			duration: 280,
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
	wipe.style.background = next === 'dark' ? '#100e0c' : '#f3ead8';
	wipe.style.opacity = '1';
	set(wipe, { scale: 0 });
	await animate(wipe, {
		scale: span / 28,
		duration: 320,
		ease: 'outCubic'
	});
	onCovered();
	await animate(wipe, { opacity: 0, duration: 140, ease: 'outQuad' });
	set(wipe, { scale: 0 });
}
