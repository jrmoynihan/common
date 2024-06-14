import { make_subroute_nav_links } from '$lib';
import { route } from '$lib/ROUTES';
import type { LayoutLoadEvent } from '../$types';

export async function load({ url }: LayoutLoadEvent) {
	const links = await make_subroute_nav_links(new URL(route('/recipes'), url.origin));
	return {
		links
	};
}
