import vercel from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import examples from 'mdsvexamples/vite';
import path from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import mdsvexConfig from './mdsvex.config.js';

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
const $tooltip = path.resolve($lib, './attach/tooltip');
const $wrappers = path.resolve($lib, './wrappers');

const config = defineConfig({
	plugins: [
		examples,
		tailwindcss(),
		sveltekit({
			preprocess: [mdsvex(mdsvexConfig)],
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
			},

			adapter: vercel({ runtime: 'nodejs20.x' }),
			alias: {
				$routes,
				$actions: path.resolve($lib, './actions'),
				$buttons: path.resolve($lib, './buttons'),
				$functions: path.resolve($lib, './functions'),
				$inputs: path.resolve($lib, './inputs'),
				$navigation: path.resolve($lib, './navigation'),
				$toasts: path.resolve($lib, './toasts'),
				$tooltip: path.resolve($lib, './attach/tooltip'),
				$wrappers: path.resolve($lib, './wrappers')
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
