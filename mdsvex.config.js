import { defineMDSveXConfig as defineConfig } from 'mdsvex';

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: true,

	remarkPlugins: [],
	rehypePlugins: []
});

export default config;
