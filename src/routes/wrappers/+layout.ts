import { route } from '$lib/ROUTES';
import { make_subroute_nav_links } from '$navigation/nav-functions.svelte';
import type { LayoutLoadEvent } from '../$types';

export async function load({ url }: LayoutLoadEvent) {
	const links = await make_subroute_nav_links(new URL(route('/wrappers'), url.origin));
	return {
		links
	};
}
