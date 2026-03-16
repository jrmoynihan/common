import type { HTMLOptgroupAttributes } from 'svelte/elements';

export interface SelectOptionGroup<Item> extends HTMLOptgroupAttributes {
	label: string;
	options: (Item | SelectOptionGroup<Item>)[];
}

export type StructuredOptions<Item> = Item[] | SelectOptionGroup<Item>[];
