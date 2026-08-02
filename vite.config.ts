import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import examples from 'mdsvexamples/vite';
import { defineConfig, type UserConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

// Kit/app config (adapter, aliases, preprocess, experimental) lives in svelte.config.js
// so svelte-package can rewrite $aliases into relative paths in dist/.
const config = defineConfig({
	plugins: [examples, tailwindcss(), sveltekit(), kitRoutes()],
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
