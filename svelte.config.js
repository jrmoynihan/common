import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			scss: true
		}),
		mdsvex(mdsvexConfig)
	],

	kit: {
		adapter: adapter(),
		alias: {
			'$app/environment': '.svelte-kit/runtime/env.js'
		}
	},

	vitePlugin: {
		experimental: {
			inspector: true
		}
	}
};

export default config;
