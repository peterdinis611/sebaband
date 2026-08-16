import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, status }) => {
	const message =
		error instanceof Error
			? error.message
			: typeof error === 'string'
				? error
				: 'Neznáma chyba';

	// 404s are expected (missing pages, browser/extension probes like /json/version)
	if (status !== 404) {
		console.error(`[seba] ${status}`, error);
	}

	return {
		message: status === 404 ? 'Stránka sa nenašla' : message
	};
};
