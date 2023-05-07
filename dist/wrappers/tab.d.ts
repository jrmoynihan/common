import type { SvelteComponentTyped } from 'svelte';
export declare class Tab {
    name: string;
    component: typeof SvelteComponentTyped;
    constructor({ ...args }: {
        [x: string]: any;
    });
}
