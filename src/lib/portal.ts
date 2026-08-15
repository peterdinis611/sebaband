import type { Action } from 'svelte/action';

/** Move a node to `document.body` so `position: fixed` is not trapped by transformed ancestors. */
export const portal: Action<HTMLElement> = (node) => {
	const placeholder = document.createComment('portal');
	node.parentNode?.insertBefore(placeholder, node);
	document.body.appendChild(node);

	return {
		destroy() {
			placeholder.parentNode?.insertBefore(node, placeholder);
			placeholder.remove();
		}
	};
};
