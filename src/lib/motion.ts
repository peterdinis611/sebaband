import { animate, createScope, onScroll, set, stagger } from 'animejs';
import { prefersLightMotion, prefersReducedMotion } from '$lib/motion-prefs';

export { prefersLightMotion, prefersReducedMotion } from '$lib/motion-prefs';

function showNow(els: Iterable<Element>) {
	for (const el of els) (el as HTMLElement).style.opacity = '1';
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
