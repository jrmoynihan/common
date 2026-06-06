import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import examples from 'mdsvexamples/vite';
import path from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

const $root = path.resolve(__dirname, './src');
const $lib = path.resolve($root, './lib');
const $routes = path.resolve($root, './routes');
const $scripts = path.resolve($lib, './scripts');
const $actions = path.resolve($lib, './actions');

const config = defineConfig({
	plugins: [examples, tailwindcss(), sveltekit(), kitRoutes()],
	resolve: {
		alias: {
			$lib,
			$routes,
			$scripts,
			$actions
		}
	},
	build: {
		sourcemap: true,
		target: 'esnext',
		cssMinify: 'esbuild'
	}
}) satisfies UserConfig;

export default config;
