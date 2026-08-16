import { browser } from '$app/environment';

/** Safe during prerender — never touch `url.searchParams` on the server. */
export function readSearchParam(name: string): string | null {
	if (!browser) return null;
	return new URLSearchParams(location.search).get(name);
}
