import { page } from '$app/stores';
import { capitalize } from '$lib/functions';
import { get } from 'svelte/store';

interface INavigationLink {
	url: URL;
	link_text?: string;
}
export class NavigationLink {
	url: URL;
	link_text: string;

	constructor(args: INavigationLink) {
		this.url = args?.url;
		this.link_text = args?.link_text ?? capitalize(this.getLastSegment(args?.url.pathname)) ?? null;
	}
	getLastSegment(pathname: string): string {
		const segments = pathname.split('/');
		return segments[segments.length - 1];
	}
}
export function makeNavLinks(
	paths: string[],
	parent_path?: string,
	link_texts?: string[]
): NavigationLink[] {
	const origin = get(page)?.url?.origin;
	let full_paths: string[] = [];

	full_paths = paths.map((path) => `${origin}${parent_path ? `/${parent_path}` : ''}/${path}`);

	const urls = full_paths.map((path) => {
		if (parent_path) return new URL(path);
		return new URL(path);
	});
	const links = urls.map((url, i) => {
		if (link_texts) {
			return new NavigationLink({ url: url, link_text: link_texts[i] });
		}
		return new NavigationLink({ url: url });
	});
	return links;
}
