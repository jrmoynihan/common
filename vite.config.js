import { sveltekit } from '@sveltejs/kit/vite';
import examples from 'mdsvexamples/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [examples, sveltekit()],
	ssr: {
		noExternal: ['@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons']
	}
};

export default config;
