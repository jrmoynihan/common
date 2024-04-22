import { capitalize, deKebab } from "$functions/helpers.svelte.js";
import { ErrorLog } from "$functions/logging.js";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons/index";
import type { NavigationTarget, Page } from "@sveltejs/kit";
import type { IconSize } from "../lib_types.js";

interface INavigationLink {
	url: URL;
	link_text?: string;
	icons?: IconLayer[];
	anchors?: NavigationLink[];
}
export class IconLayer {
	icon?: IconDefinition;
	size?: IconSize;
	translateX?: number;
	translateY?: number;
	color?: string;
	text?: string;
	scale?: number;
	style?: string;

	constructor(args: IconLayer) {
		this.icon = args?.icon;
		this.size = args?.size;
		this.translateX = args?.translateX;
		this.translateY = args?.translateY;
		this.color = args?.color;
		this.text = args?.text;
		this.scale = args?.scale;
		this.style = args?.style;
	}
}
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
		this.link_text = args?.link_text
			? capitalize(deKebab(args?.link_text))
			: "";
		this.icons = args?.icons ?? undefined;
		this.anchors = args?.anchors ?? undefined;
		this.is_current_page = false;
	}

	isCurrentPage = (
		page: Page<Record<string, string>, string | null>,
	): boolean => {
		const is_current = page?.url?.pathname === this.url?.pathname;
		this.is_current_page = is_current;
		return is_current;
	};
}

export async function get_subroutes(current_pathname: string) {
	const match = `/src/routes${
		current_pathname === "/" ? "" : current_pathname
	}/`;
	const all_path_components = import.meta.glob("/src/routes/**/*.svelte");
	const subdirectories = Object.entries(all_path_components)
		.map(([key, value]) => {
			const trimmed_key = key.replace(match, "").replace("/+page.svelte", "");
			return { path: key, name: trimmed_key };
		})
		.filter(({ path, name }) => {
			if (
				path.includes("+page.svelte") &&
				path.includes(match) &&
				path !== `${match}+page.svelte`
			) {
				// Retain only *direct* sub-routes
				return !name.includes("/");
			}
		})
		.map(({ name }) => name);

	return subdirectories;
}

export async function make_subroute_nav_links(
	imported_meta_url: string,
	load_event_url: URL,
	icon_map?: Map<string, IconLayer>,
) {
	const base_url = await make_base_url(imported_meta_url, load_event_url);
	const is_root_path = base_url.pathname.endsWith("/");
	const subroutes = await get_subroutes(base_url.pathname);
	const nav_links = subroutes.map((name) => {
		const subroute_url = new URL(
			`${base_url.origin}${base_url.pathname}${is_root_path ? "" : "/"}${name}`,
		);
		return new NavigationLink({
			url: subroute_url,
			link_text: name,
			icons: icon_map ? [{ ...icon_map.get(name) }] : undefined,
		});
	});
	return nav_links;
}
async function make_base_url(imported_meta_url: string, load_url: URL) {
	const replaced_meta_url = imported_meta_url.replace("/src/routes", ""); // Remove the source directory portion
	const slice_index = replaced_meta_url.indexOf("/+"); // Find index of page or layout `+`descriptor
	const sliced_meta = replaced_meta_url.slice(0, slice_index); // Slice at that index to get the rest of the address path
	return new URL(sliced_meta, load_url.href); // Make a URL object from that, which forms the base for all the subroutes
}

/** Compares the navigation targets (from and to) and returns true if layout should transition, and false if it should not */
export async function shouldLayoutTransitionOnNavigation({
	from,
	to,
	layout_parent_path,
} : {from: NavigationTarget,
	to: NavigationTarget,
	layout_parent_path: string}) {
	try {
		if (from?.url.pathname === to?.url.pathname) return false;

		// Ignore the empty string to the left of the first slash in the route id
		const from_routeID = from?.route?.id?.split("/").slice(1);
		const to_routeID = to?.route?.id?.split("/").slice(1);
		
		// console.trace({from, to, from_routeID, to_routeID, layout_parent})
		if (from_routeID && to_routeID) {
			// If the beginning of the path is different, it should always transition.  You're moving to a new part of the route hierarchy.
			if (from_routeID[0] !== to_routeID[0] && to_routeID[0]) {
				// console.log('returning true because beginning of path is different');
				return true;
			}
			if(from_routeID.length !== to_routeID.length) {
				// console.log('returning false because lengths are different');
				return false
			}
			console.log(to_routeID[to_routeID.length - 2])
			if(to_routeID[to_routeID.length - 2] && to_routeID[to_routeID.length - 2] === layout_parent_path && from_routeID[from_routeID.length - 1] !== to_routeID[to_routeID.length - 1]) {
					return true;
				}		
		}
		return false;
	} catch (error) {
		if (error instanceof Error) ErrorLog({ error });
	}
}
