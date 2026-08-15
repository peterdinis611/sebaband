import type { Action } from 'svelte/action';

/** Mount node on `document.body`. On destroy, remove it — do not re-insert (breaks `{#if}`). */
export const portal: Action<HTMLElement> = (node) => {
	document.body.appendChild(node);

	return {
		destroy() {
			node.remove();
		}
	};
};
