<script module lang="ts">
	import type { IconProps } from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import type { NavigationLink } from './nav-functions.svelte.js';

	export interface NavigationProps extends HTMLAttributes<HTMLElement> {
		/** An array of items to display within the nav wrapper element.  You can provide links here or manually create `<NavLink>` components and provide them to the `children` snippet.  */
		links?: NavigationLink[];
		/**
		 * Layout whose **direct child pages** become links. Omit in `+layout.svelte`
		 * (the layout-file preprocessor fills this from the folder). Otherwise pass
		 * `import.meta.url` from the layout, or a Kit `RouteId`.
		 */
		parent_path?: string;
		/** Iconify props keyed by the child route's last path segment (`buttons`, `accordion`, …). */
		icon_map?: Map<string, IconProps>;
		/** Attributes to apply to the <a> elements.  Can be a uniform object to apply to all links, or an array of individual attribute objects to apply to each link separately (in order of appearance). */
		link_attributes?: HTMLAnchorAttributes | HTMLAnchorAttributes[];
		/** A snippet to render as the children of the <nav> element.*/
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { beforeNavigate } from '$app/navigation';
	import NavLink from '#navigation/NavLink.svelte';
	import { make_subroute_nav_links } from './nav-functions.svelte.js';

	let {
		links,
		parent_path,
		icon_map,
		link_attributes,
		children,
		...nav_attributes
	}: NavigationProps = $props();

	const resolved_links = $derived(
		links ?? (parent_path !== undefined ? make_subroute_nav_links(parent_path, icon_map) : [])
	);

	// Close any open dialog elements before navigating.
	beforeNavigate(({ shallow }) => {
		if (shallow) return;

		if (browser) {
			const dialogs = document.getElementsByTagName('dialog');
			if (dialogs?.length > 0) {
				for (const dialog of dialogs) {
					dialog?.close();
				}
			}
		}
	});
</script>

<!-- svelte-ignore a11y_no_redundant_roles -->
<nav role="navigation" {...nav_attributes} class={['_navigation', nav_attributes?.class]}>
	{#each resolved_links as nav_link, i (nav_link.href)}
		{@const attributes = Array.isArray(link_attributes) ? link_attributes[i] : link_attributes}
		<NavLink {nav_link} {...attributes} />
	{/each}
	{@render children?.()}
</nav>

<style>
	@layer common.navigation {
		nav._navigation {
			display: var(--nav-display, flex);
			flex-wrap: var(--nav-flex-wrap, wrap);
			align-items: var(--nav-align-items, center);
			justify-content: var(--nav-justify-content, center);
			margin: var(--nav-margin, 1rem auto);
			max-width: var(--nav-max-width, max-content);
			gap: var(--nav-gap, 1rem);
		}
	}
</style>
