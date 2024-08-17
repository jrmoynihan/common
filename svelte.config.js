// import auto from '@sveltejs/adapter-auto';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const $filepath = dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/');
const $src = path.resolve($filepath, './src');
const $lib = path.resolve($src, './lib');
const $routes = path.resolve($src, './routes');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		mdsvex(mdsvexConfig),
		vitePreprocess({
			style: {
				postcss: true
			}
		})
	],

	kit: {
		adapter: vercel({ runtime: 'nodejs20.x' }),
		alias: {
			$routes,
			$actions: path.resolve($lib, './actions'),
			$buttons: path.resolve($lib, './buttons'),
			$functions: path.resolve($lib, './functions'),
			$inputs: path.resolve($lib, './inputs'),
			$navigation: path.resolve($lib, './navigation'),
			$toasts: path.resolve($lib, './toasts'),
			$tooltip: path.resolve($lib, './tooltip'),
			$wrappers: path.resolve($lib, './wrappers')
		}
	}

	// vitePlugin: {
	// 	inspector: true
	// }
};

export default config;
