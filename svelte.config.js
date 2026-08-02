import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...(mdsvexConfig.extensions ?? [])],
	preprocess: [mdsvex(mdsvexConfig)],
	compilerOptions: {
		experimental: {
			async: true
		},
		modernAst: true
	},
	kit: {
		adapter: adapter({ runtime: 'nodejs20.x' }),
		// Must live here (not only in vite.config) so svelte-package rewrites aliases in dist/.
		// See https://svelte.dev/docs/kit/packaging#Best-practices
		alias: {
			$routes: 'src/routes',
			$scripts: 'src/lib/scripts',
			$actions: 'src/lib/actions',
			$buttons: 'src/lib/buttons',
			$functions: 'src/lib/functions',
			$inputs: 'src/lib/inputs',
			$navigation: 'src/lib/navigation',
			$toasts: 'src/lib/toasts',
			$tooltip: 'src/lib/attach/tooltip',
			$wrappers: 'src/lib/wrappers'
		},
		experimental: {
			remoteFunctions: true,
			forkPreloads: true,
			handleRenderingErrors: true
		}
	}
};

export default config;
