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
const $buttons = path.resolve($lib, './buttons');
const $functions = path.resolve($lib, './functions');
const $inputs = path.resolve($lib, './inputs');
const $navigation = path.resolve($lib, './navigation');
const $toasts = path.resolve($lib, './toasts');
const $tooltip = path.resolve($lib, './tooltip');
const $wrappers = path.resolve($lib, './wrappers');

const config = defineConfig({
	plugins: [
		examples,
		tailwindcss(),
		sveltekit({
			experimental: {
				remoteFunctions: true,
				forkPreloads: true,
				handleRenderingErrors: true
			},
			compilerOptions: {
				experimental: {
					async: true
				},
				modernAst: true
			}
		}),
		kitRoutes()
	],
	resolve: {
		alias: {
			$lib,
			$routes,
			$scripts,
			$actions,
			$buttons,
			$functions,
			$inputs,
			$navigation,
			$toasts,
			$tooltip,
			$wrappers
		}
	},
	build: {
		sourcemap: true,
		target: 'esnext',
		cssMinify: 'esbuild'
	},
	css: {
		transformer: 'lightningcss'
	}
}) satisfies UserConfig;

export default config;
