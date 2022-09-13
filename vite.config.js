import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import examples from 'mdsvexamples/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [examples, sveltekit()],
	resolve: {
		alias: {
			$routes: path.resolve('./src/routes')
		}
	}
};

export default config;
