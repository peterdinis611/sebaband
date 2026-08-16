import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({
				fallback: undefined,
				precompress: true,
				strict: true
			})
		})
	],
	ssr: {
		// @lucide/svelte ships .js that re-exports .svelte — must be bundled for Node SSR
		noExternal: ['@lucide/svelte']
	},
	optimizeDeps: {
		// Prebundling treats compiled icon .svelte as JS and blows up on new.target
		exclude: ['@lucide/svelte']
	}
});
