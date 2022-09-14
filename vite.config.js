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
	},
	ssr: {
		noExternal: ['@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons']
	},
	optimizeDeps: ['@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons']
};

export default config;
