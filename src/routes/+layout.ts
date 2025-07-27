import { route } from '$lib/ROUTES';
import { make_subroute_nav_links } from '$navigation/nav-functions.svelte';
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

	const nav_links = await make_subroute_nav_links(new URL(route('/'), url.origin), icon_map);

	return {
		nav_links
	};
}
