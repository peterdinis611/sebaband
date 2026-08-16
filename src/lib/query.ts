import { browser } from '$app/environment';

/** Safe during prerender — never touch `url.searchParams` on the server. */
export function isPreviewMode(): boolean {
	if (!browser) return false;
	return new URLSearchParams(location.search).get('preview') === '1';
}

export function readSearchParam(name: string): string | null {
	if (!browser) return null;
	return new URLSearchParams(location.search).get(name);
}
