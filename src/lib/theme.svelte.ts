import { prefersReducedMotion } from '$lib/motion-prefs';

export type ThemeName = 'light' | 'dark';

export const theme = $state({
	mode: 'light' as ThemeName
});

let flipping = false;

function apply(mode: ThemeName) {
	document.documentElement.dataset.theme = mode;
	document.documentElement.style.colorScheme = mode;
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute('content', mode === 'dark' ? '#100e0c' : '#f3ead8');
}

export function hydrateTheme() {
	const stored = localStorage.getItem('seba-theme');
	const mode: ThemeName =
		stored === 'dark' || stored === 'light'
			? stored
			: window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
	theme.mode = mode;
	apply(mode);
}

export async function toggleTheme(origin?: HTMLElement) {
	if (flipping) return;
	const next: ThemeName = theme.mode === 'dark' ? 'light' : 'dark';
	const commit = () => {
		theme.mode = next;
		localStorage.setItem('seba-theme', next);
		apply(next);
	};

	if (!origin || prefersReducedMotion()) {
		commit();
		return;
	}

	flipping = true;
	try {
		const { playThemeWipe } = await import('$lib/motion');
		await playThemeWipe(origin, next, commit);
	} finally {
		flipping = false;
	}
}
