import { sveltekit } from '@sveltejs/kit/vite';
import examples from 'mdsvexamples/vite';
import path from 'node:path';
import { kitRoutes } from 'vite-plugin-kit-routes';
import tailwindcss from '@tailwindcss/vite';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import type { UserConfig } from 'vite';

const $root = path.resolve(__dirname, './src');
const $lib = path.resolve($root, './lib');
const $routes = path.resolve($root, './routes');
const $scripts = path.resolve($lib, './scripts');
const $actions = path.resolve($lib, './actions');

const config: UserConfig = {
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
		cssMinify: 'lightningcss'
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist('>= 0.25%'))
		}
	}
};

export default config;
