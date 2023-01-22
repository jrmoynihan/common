import { page } from '$app/stores';
import { capitalize, deKebab } from '$functions/helpers.js';
import { ErrorLog } from '$functions/logging.js';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons/index';
import type { NavigationTarget, Page } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { IconSize } from '../lib_types.js';

interface INavigationLink {
	url: URL;
	link_text?: string;
	icons?: IconLayer[];
	anchors?: NavigationLink[];
}
export type IconLayer = {
	icon?: IconDefinition;
	size?: IconSize;
	translateX?: number;
	translateY?: number;
	color?: string;
	text?: string;
	scale?: number;
	style?: string;
};
export class NavigationLink {
	/** The URL object describing the link */
	url: URL;
	/** The displayed text for the link (defaults to the link's pathname)*/
	link_text: string;
	/** Pass in an array of icons to use in a FaLayer component. */
	icons: IconLayer[] | undefined;
	/** Pass in an array of NavigationLinks to use as anchors for the link. */
	anchors: NavigationLink[] | undefined;
	/** Whether or not the link is the current page.  Can update with the `isCurrentPage()` method. */
	is_current_page: boolean;

	constructor(args: INavigationLink) {
		this.url = args?.url;
		this.link_text =
			args?.link_text ?? capitalize(deKebab(this.getLastSegment(args?.url.pathname))) ?? null;
		this.icons = args?.icons ?? undefined;
		this.anchors = args?.anchors ?? undefined;
		this.is_current_page = this.isCurrentPage(get(page)) ?? false;
	}
	private getLastSegment(pathname: string): string {
		const segments = pathname.split('/');
		return segments[segments.length - 1];
	}
	isCurrentPage(page: Page<Record<string, string>, string | null>): boolean {
		const is_current = page?.url?.pathname === this.url.pathname;
		this.is_current_page = is_current;
		return is_current;
	}
}

export interface makeNavLinksOptions {
	paths: string[];
	make_anchors?: boolean;
	parent_path?: string;
	link_texts?: string[];
	link_icons?: IconLayer[][];
	anchors?: NavigationLink[];
}
export async function makeAnchorLinks(input: makeNavLinksOptions) {
	return makeLinks({ ...input, make_anchors: true });
}
export async function makeNavLinks(input: makeNavLinksOptions) {
	return makeLinks({ ...input, make_anchors: false });
}
export async function makeLinks(input: makeNavLinksOptions): Promise<NavigationLink[]> {
	const { paths, parent_path, anchors, link_texts, link_icons, make_anchors } = input;
	const origin = get(page)?.url?.origin;
	let full_paths: string[] = [];

	full_paths = paths.map(
		(path) => `${origin}${parent_path ? `/${parent_path}` : ''}/${make_anchors ? '#' : ''}${path}`
	);

	const urls = full_paths.map((path) => {
		if (parent_path) return new URL(path);
		return new URL(path);
	});
	const links = urls.map((url, i) => {
		let link_props: INavigationLink = { url };
		if (anchors) {
			link_props = { ...link_props, anchors };
		}
		if (link_texts) link_props = { ...link_props, link_text: link_texts[i] };
		if (link_icons) link_props = { ...link_props, icons: link_icons[i] };
		return new NavigationLink(link_props);
	});
	return links;
}
/** Compares the navigation targets (from and to) and returns true if layout should transition, and false if it should not */
export async function shouldLayoutTransitionOnNavigation(
	from: NavigationTarget,
	to: NavigationTarget,
	layout_parent: string
) {
	try {
		if (from?.url.pathname === to?.url.pathname) {
			return false;
		}
		const from_routeID = from?.route?.id?.split('/');
		const to_routeID = to?.route?.id?.split('/');
		// Shift off the empty string to the left of the first slash in the route id
		from_routeID?.shift();
		to_routeID?.shift();
		if (from_routeID && to_routeID) {
			// If the two paths belong to the same layout (i.e. have the same starting route ID), that layout's transition component should trigger a transition.
			if (from_routeID[0] === layout_parent && to_routeID[0] === layout_parent) {
				return true;
			}
			// If the beginning of the path is different, it should always transition.  You're moving to a new part of the route hierarchy.
			if (from_routeID[0] !== to_routeID[0] && to_routeID[0]) {
				return true;
			}
		}
		return false;
	} catch (error) {
		if (error instanceof Error) ErrorLog({ error });
	}
}
