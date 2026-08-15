import {
	animate,
	createScope,
	createTimeline,
	onScroll,
	set,
	splitText,
	stagger
} from 'animejs';

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function showNow(els: Iterable<Element>) {
	for (const el of els) (el as HTMLElement).style.opacity = '1';
}

export function playLanding(root: HTMLElement): () => void {
	if (prefersReducedMotion()) {
		showNow(root.querySelectorAll('.js-await, .js-stat'));
		return () => {};
	}

	let split: ReturnType<typeof splitText> | null = null;

	const scope = createScope({ root }).add(() => {
		const title = root.querySelector('.js-hero-title');
		const kicker = root.querySelector('.js-hero-kicker');
		const lede = root.querySelector('.js-hero-lede');
		const ctas = root.querySelector('.js-hero-ctas');
		const region = root.querySelector('.js-hero-region');
		const photo = root.querySelector('.js-hero-photo');
		const stats = root.querySelectorAll('.js-stat');

		split = title ? splitText(title, { chars: true }) : null;
		split?.chars.forEach((char) => {
			(char as HTMLElement).style.display = 'inline-block';
		});
		if (split?.chars.length) {
			set(split.chars, { opacity: 0, y: 72, rotate: 8 });
		}

		const tl = createTimeline({ defaults: { ease: 'outExpo' } });

		if (kicker) {
			tl.add(kicker, { opacity: [0, 1], y: [18, 0], duration: 700 }, 0);
		}
		if (split?.chars.length) {
			tl.add(
				split.chars,
				{
					opacity: [0, 1],
					y: [72, 0],
					rotate: [8, 0],
					duration: 980,
					delay: stagger(22, { from: 'first' }),
					ease: 'outExpo'
				},
				60
			);
		} else if (title) {
			tl.add(title, { opacity: [0, 1], y: [28, 0], duration: 800 }, 60);
		}
		if (lede) tl.add(lede, { opacity: [0, 1], y: [22, 0], duration: 780 }, 380);
		if (ctas) tl.add(ctas, { opacity: [0, 1], y: [18, 0], duration: 700 }, 500);
		if (region) tl.add(region, { opacity: [0, 1], duration: 600 }, 620);
		if (photo) {
			tl.add(
				photo,
				{ opacity: [0, 1], y: [56, 0], scale: [0.94, 1], duration: 1100, ease: 'outExpo' },
				140
			);
		}
		if (stats.length) {
			tl.add(
				stats,
				{
					opacity: [0, 1],
					y: [24, 0],
					duration: 640,
					delay: stagger(90)
				},
				720
			);
		}
	});

	return () => {
		split?.revert();
		scope.revert();
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
		const links = el.querySelectorAll('nav a');
		if (links.length) set(links, { opacity: 0, y: -10 });
		animate(el, {
			y: [-14, 0],
			duration: 640,
			ease: 'outExpo'
		});
		if (links.length) {
			animate(links, {
				opacity: 1,
				y: 0,
				delay: stagger(40),
				duration: 520,
				ease: 'outQuad'
			});
		}
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
	const split = title ? splitText(title, { chars: true }) : null;
	split?.chars.forEach((char) => {
		(char as HTMLElement).style.display = 'inline-block';
	});
	if (split?.chars.length) {
		set(split.chars, { opacity: 0, y: 48 });
	}

	const tl = createTimeline({ defaults: { ease: 'outExpo' } });
	if (kicker) tl.add(kicker, { opacity: [0, 1], y: [14, 0], duration: 600 }, 0);
	if (split?.chars.length) {
		tl.add(
			split.chars,
			{
				opacity: [0, 1],
				y: [48, 0],
				duration: 820,
				delay: stagger(16)
			},
			40
		);
	} else if (title) {
		tl.add(title, { opacity: [0, 1], y: [20, 0], duration: 720 }, 40);
	}
	if (lede) tl.add(lede, { opacity: [0, 1], y: [18, 0], duration: 700 }, 280);
	const stamp = el.querySelector('.stamp');
	if (stamp) {
		set(stamp, { opacity: 0, scale: 1.45, rotate: -22 });
		tl.add(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 520 }, 360);
	}

	return () => {
		tl.revert();
		split?.revert();
	};
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

function loadHeroImage(): Promise<void> {
	return new Promise((resolve) => {
		const img = new Image();
		const done = () => resolve();
		img.onload = done;
		img.onerror = () => {
			if (!img.src.includes('hero-band.jpg')) {
				img.src = '/images/hero-band.jpg';
				return;
			}
			done();
		};
		img.src = '/images/hero-band.webp';
		if (typeof img.decode === 'function') {
			img.decode().then(done).catch(done);
		}
	});
}

export async function playBoot(root: HTMLElement): Promise<void> {
	const done = () => {
		document.documentElement.classList.remove('is-booting');
		root.remove();
	};

	if (prefersReducedMotion()) {
		done();
		return;
	}

	const title = root.querySelector('.js-boot-title');
	const kicker = root.querySelector('.js-boot-kicker');
	const stamp = root.querySelector('.js-boot-stamp');
	const bar = root.querySelector<HTMLElement>('.js-boot-bar');
	const pct = root.querySelector<HTMLElement>('.js-boot-pct');

	const split = title ? splitText(title, { chars: true }) : null;
	split?.chars.forEach((char) => {
		(char as HTMLElement).style.display = 'inline-block';
	});
	if (split?.chars.length) set(split.chars, { opacity: 0, y: 56, rotate: 8 });
	if (kicker) set(kicker, { opacity: 0, y: 14 });
	if (stamp) set(stamp, { opacity: 0, scale: 1.4, rotate: -22 });
	if (bar) {
		bar.style.animation = 'none';
		set(bar, { scaleX: 0.08 });
	}

	const intro = createTimeline({ defaults: { ease: 'outExpo' } });
	if (kicker) intro.add(kicker, { opacity: 1, y: 0, duration: 420 }, 0);
	if (split?.chars.length) {
		intro.add(
			split.chars,
			{
				opacity: 1,
				y: 0,
				rotate: 0,
				duration: 720,
				delay: stagger(28)
			},
			80
		);
	}
	if (stamp) intro.add(stamp, { opacity: 1, scale: 1, rotate: -8, duration: 420 }, 360);

	if (bar) {
		animate(bar, {
			scaleX: 0.86,
			duration: 1500,
			ease: 'inOutQuad',
			onRender: (self) => {
				if (pct) pct.textContent = String(Math.max(8, Math.round(self.progress * 86)));
			}
		});
	}

	await Promise.race([
		Promise.all([document.fonts?.ready ?? Promise.resolve(), loadHeroImage(), sleep(980), intro]),
		sleep(2200)
	]);

	if (bar) {
		await animate(bar, {
			scaleX: 1,
			duration: 280,
			ease: 'outExpo',
			onRender: () => {
				if (pct) pct.textContent = '100';
			}
		});
	} else if (pct) pct.textContent = '100';

	await sleep(140);
	await animate(root, { y: '-110%', duration: 720, ease: 'inOutExpo' });
	split?.revert();
	done();
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
