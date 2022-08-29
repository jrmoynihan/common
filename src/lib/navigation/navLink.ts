import { page } from '$app/stores';
import { capitalize } from '$lib/functions';
import { get } from 'svelte/store';

interface INavigationLink {
	link: URL;
	link_text?: string;
}
export class NavigationLink {
	link: URL;
	link_text: string;

	constructor(args: INavigationLink) {
		this.link = args?.link;
		this.link_text =
			args?.link_text ?? capitalize(this.getLastSegment(args?.link.pathname)) ?? null;
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
			return new NavigationLink({ link: url, link_text: link_texts[i] });
		}
		return new NavigationLink({ link: url });
	});
	return links;
}
