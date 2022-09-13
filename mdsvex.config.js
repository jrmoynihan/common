import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import codesandbox from 'remark-codesandbox';
import examples from 'mdsvexamples';

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: true,

	remarkPlugins: [
		examples,
		{
			defaults: {
				Wrapper: './src/routes/NoBackgroundWrapper.svelte'
			}
		}
	],
	rehypePlugins: []
});

export default config;
