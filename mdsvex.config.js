import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import codesandbox from 'remark-codesandbox';

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: true,

	remarkPlugins: [codesandbox({ mode: 'button' })],
	rehypePlugins: []
});

export default config;
