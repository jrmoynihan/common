import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$routes: path.resolve('./src/routes')
		}
	},
	ssr: {
		external: ['$app/environment']
	},
	build: {
		external: ['$app/environment']
	},
	optimizeDeps: {
		exclude: ['$app/environment']
	}
};

export default config;
