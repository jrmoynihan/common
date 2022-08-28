import type { SvelteComponentTyped } from 'svelte';

export class Tab {
	name: string;
	component: typeof SvelteComponentTyped;
	constructor({ ...args }) {
		this.name = args.name;
		this.component = args.component;
	}
}
