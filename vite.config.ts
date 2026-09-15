import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import examples from 'mdsvexamples/vite';
import { defineConfig, type UserConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

// Kit 3 config belongs on the sveltekit() plugin. Package-internal aliases live in
// package.json "imports" so Vite and TypeScript resolve them as Node subpath imports.
const config = defineConfig({
	plugins: [
		examples,
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', ...(mdsvexConfig.extensions ?? [])],
			preprocess: [mdsvex(mdsvexConfig)],
			compilerOptions: { experimental: { async: true }, modernAst: true },
			adapter: adapter(),
			experimental: { remoteFunctions: true, forkPreloads: true }
		}),
		kitRoutes()
	],
	build: { sourcemap: true, target: 'esnext', cssMinify: 'esbuild' },
	css: { transformer: 'lightningcss' }
}) satisfies UserConfig;

export default config;
