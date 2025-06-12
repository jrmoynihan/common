import { capitalize, dekebab } from '$functions/helpers.svelte.js';
import { ErrorLog } from '$functions/logging.js';
import type { IconProps } from '@iconify/svelte';
import type { NavigationTarget, Page } from '@sveltejs/kit';

interface INavigationLink {
	url: URL;
	link_text?: string;
	icon?: IconProps;
	anchors?: NavigationLink[];
}

export class NavigationLink {
	/** The URL object describing the link */
	url: URL;
	/** The displayed text for the link (defaults to the link's pathname)*/
	link_text: string;
	/** Pass in an icon to use in a Iconify component. */
	icon?: IconProps;
	/** Pass in an array of NavigationLinks to use as anchors for the link. */
	anchors: NavigationLink[] | undefined;
	/** Whether or not the link is the current page.  Can update with the `isCurrentPage()` method. */
	is_current_page: boolean;

	constructor(args: INavigationLink) {
		this.url = args?.url;
		this.link_text = args?.link_text ? capitalize(dekebab(args?.link_text)) : '';
		this.icon = args?.icon ?? undefined;
		this.anchors = args?.anchors ?? undefined;
		this.is_current_page = false;
	}

	isCurrentPage = (page: Page): boolean => {
		const is_current = page?.url?.pathname === this.url?.pathname;
		this.is_current_page = is_current;
		return is_current;
	};
	is_page_within_path = (page: Page): boolean => {
		return page?.url?.pathname.startsWith(this.url?.pathname);
	};
}

export async function get_subroutes(url_pathname: string, exclude_paths?: string[]) {
	const full_path = `/src/routes${url_pathname === '/' ? '' : url_pathname}/`;
	const all_path_components = import.meta.glob('/src/routes/**/*.svelte');
	const subdirectories = Object.entries(all_path_components)
		.map(([key, value]) => {
			const trimmed_key = key.replace(full_path, '').replace('/+page.svelte', '');
			return { path: key, name: trimmed_key };
		})
		.filter((path) => filter_path(path, full_path))
		.map(({ name }) => name);

	return subdirectories;
}
function filter_path({ path, name }: { path: string; name: string }, full_path: string) {
	if (
		path.includes('+page.svelte') &&
		path.includes(full_path) &&
		path !== `${full_path}+page.svelte`
	) {
		// Retain only *direct* sub-routes
		return !name.includes('/');
	}
}

export async function make_subroute_nav_links(
	load_event_url: URL,
	icon_map?: Map<string, IconProps>
) {
	const is_root_path = load_event_url.pathname.endsWith('/');
	const subroutes = await get_subroutes(load_event_url.pathname);
	const nav_links = subroutes.map((name) => {
		const subroute_url = new URL(
			`${load_event_url.origin}${load_event_url.pathname}${is_root_path ? '' : '/'}${name}`
		);
		return new NavigationLink({
			url: subroute_url,
			link_text: name,
			icon: icon_map?.get(name)
		});
	});

	return nav_links;
}

/** Compares the navigation targets (from and to) and returns true if layout should transition, and false if it should not */
export async function shouldLayoutTransitionOnNavigation({
	from,
	to,
	layout_parent_path
}: {
	from: NavigationTarget;
	to: NavigationTarget;
	layout_parent_path: string;
}) {
	try {
		if (from?.url.pathname === to?.url.pathname) return false;

		// Ignore the empty string to the left of the first slash in the route id
		const from_routeID = from?.route?.id?.split('/').slice(1);
		const to_routeID = to?.route?.id?.split('/').slice(1);

		// console.trace({from, to, from_routeID, to_routeID, layout_parent})
		if (from_routeID && to_routeID) {
			// If the beginning of the path is different, it should always transition.  You're moving to a new part of the route hierarchy.
			if (from_routeID[0] !== to_routeID[0] && to_routeID[0]) {
				// console.log('returning true because beginning of path is different');
				return true;
			}
			if (from_routeID.length !== to_routeID.length) {
				// console.log('returning false because lengths are different');
				return false;
			}
			if (
				to_routeID[to_routeID.length - 2] &&
				to_routeID[to_routeID.length - 2] === layout_parent_path &&
				from_routeID[from_routeID.length - 1] !== to_routeID[to_routeID.length - 1]
			) {
				return true;
			}
		}
		return false;
	} catch (error) {
		if (error instanceof Error) ErrorLog({ error });
	}
}
