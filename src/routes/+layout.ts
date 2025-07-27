import type { LayoutLoadEvent } from './$types';

export async function load({ url }: LayoutLoadEvent) {
	const icon_map = new Map([
		['buttons', { icon: 'fa6-solid:computer-mouse' }],
		['functions', { icon: 'fa6-solid:calculator' }],
		['inputs', { icon: 'fa6-solid:keyboard' }],
		['recipes', { icon: 'fa6-solid:receipt' }],
		['tooltips', { icon: 'material-symbols:tooltip-outline' }],
		['wrappers', { icon: 'carbon:container-software' }]
	]);

	return {
		url,
		icon_map
	};
}
