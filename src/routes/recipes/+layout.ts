import { make_subroute_nav_links } from '$lib';
import type { LayoutLoadEvent } from '../$types';

export async function load({ url }: LayoutLoadEvent) {
	const links = await make_subroute_nav_links(url);
	return {
		links
	};
}
