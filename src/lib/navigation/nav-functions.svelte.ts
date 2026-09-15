import type { NavigationTarget } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { capitalize, dekebab, enumerate_runed_properties } from '../functions/helpers.svelte.js';
import { ErrorLog } from '../functions/logging.js';
import type { IconProps } from '@iconify/svelte';
import {
	layout_route_segment,
	route_id_from_filename,
	to_nav_parent_path
} from './layout_route_id.js';

export { layout_route_segment, route_id_from_filename, to_nav_parent_path };

export class NavigationLink {
	/** The URL object describing the link */
	url = $state<URL | null>(null);
	/** The displayed text for the link (defaults to the link's pathname)*/
	link_text: string = $state('');
	/** Pass in icon props to use in a Iconify component. */
	icon_props?: IconProps = $state(undefined);
	/** Pass in an array of NavigationLinks to use as anchors for the link. */
	anchors: NavigationLink[] | undefined = $state();
	/** Whether or not the link is the current page. */
	is_current_page: boolean = $derived(page.url.pathname === this.url?.pathname);
	/** Whether or not the link is within the current page's path. */
	is_page_in_path: boolean = $derived(
		this.url !== null && page.url.pathname.startsWith(this.url.pathname)
	);

	constructor(args: Partial<NavigationLink>) {
		this.url = args?.url ?? null;
		this.link_text = args?.link_text ? capitalize(dekebab(args?.link_text)) : '';
		this.icon_props = args?.icon_props ?? undefined;
		this.anchors = args?.anchors ?? undefined;
		enumerate_runed_properties(this);
	}
	get href() {
		return this.url?.href ?? '#';
	}
	get is_valid() {
		return this.url !== null;
	}
}

function all_page_route_ids(): string[] {
	return Object.keys(import.meta.glob('/src/routes/**/+page.svelte')).map(
		(file) => route_id_from_filename(file) ?? '/'
	);
}

function normalize_parent_path(pathname: string): string {
	if (pathname === '/' || pathname === '') return '';
	return pathname.replace(/\/+$/, '');
}

function is_direct_child_route(parent_pathname: string, route_id: string): boolean {
	if (route_id.includes('[')) return false;
	const parent = normalize_parent_path(parent_pathname);
	const prefix = parent === '' ? '/' : `${parent}/`;
	if (!route_id.startsWith(prefix)) return false;
	const rest = route_id.slice(prefix.length);
	return rest.length > 0 && !rest.includes('/');
}

/** Kit `RouteId`, a layout `import.meta.url`, or a `+layout` filename. */
export type NavParentPath = string;

/** Direct child page segment names of `parent_pathname` from the app's `src/routes`. */
export function get_subroutes(parent_pathname: NavParentPath, exclude_paths?: string[]): string[] {
	const parent_id = to_nav_parent_path(parent_pathname);
	const parent = normalize_parent_path(parent_id);
	const prefix = parent === '' ? '/' : `${parent}/`;
	return all_page_route_ids()
		.filter((id) => is_direct_child_route(parent_id, id))
		.map((id) => id.slice(prefix.length))
		.filter((name) => !exclude_paths?.includes(name));
}

/**
 * Nav links for direct children of a **layout path** (`/` or `/recipes`), not the current page URL.
 * Discovers pages with `import.meta.glob` so Kit 2 consumers do not need `$app/manifest`.
 */
export function make_subroute_nav_links(
	parent_path: NavParentPath | URL = '/',
	icon_map?: Map<string, IconProps>
): NavigationLink[] {
	const parent_pathname = to_nav_parent_path(parent_path);
	const parent = normalize_parent_path(parent_pathname);
	const prefix = parent === '' ? '/' : `${parent}/`;

	return all_page_route_ids().flatMap((route_id) => {
		if (!is_direct_child_route(parent_pathname, route_id)) return [];
		const name = route_id.slice(prefix.length);
		return [
			new NavigationLink({
				url: new URL(resolve(route_id as '/'), page.url.href),
				link_text: name,
				icon_props: icon_map?.get(name)
			})
		];
	});
}

/** Compares the navigation targets (from and to) and returns true if layout should transition, and false if it should not */
export async function should_layout_transition_on_navigation({
	from,
	to,
	layout_parent_path
}: {
	from: NavigationTarget;
	to: NavigationTarget;
	layout_parent_path: NavParentPath | URL;
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
				to_routeID.at(-2) &&
				to_routeID.at(-2) === layout_route_segment(layout_parent_path) &&
				from_routeID.at(-1) !== to_routeID.at(-1)
			) {
				return true;
			}
		}
		return false;
	} catch (error) {
		if (error instanceof Error) ErrorLog({ error });
	}
}
