export type ThemeName = 'light' | 'dark';

export const theme = $state({
	mode: 'light' as ThemeName
});

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

/** Instant theme swap — no wipe animation (keeps main thread free). */
export function toggleTheme(_origin?: HTMLElement) {
	const next: ThemeName = theme.mode === 'dark' ? 'light' : 'dark';
	theme.mode = next;
	localStorage.setItem('seba-theme', next);
	apply(next);
}
