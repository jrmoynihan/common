import type { SvelteComponent } from 'svelte';

export class Tab {
	name: string;
	component: typeof SvelteComponent<any>;
	constructor({ ...args }) {
		this.name = args.name;
		this.component = args.component;
	}
}
