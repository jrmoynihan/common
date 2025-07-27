<script module lang="ts">
	export interface NavigationProps extends HTMLAttributes<HTMLElement> {
		/** An array of items to display within the nav wrapper element.  You can provide links here or manually create `<NavLink>` components and provide them to the `children` snippet.  */
		links?: NavigationLink[];
		/** Attributes to apply to the <a> elements.  Can be a uniform object to apply to all links, or an array of individual attribute objects to apply to each link separately (in order of appearance). */
		link_attributes?: HTMLAnchorAttributes | HTMLAnchorAttributes[];
		/** A snippet to render as the children of the <nav> element.*/
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import NavLink from '$navigation/NavLink.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import type { NavigationLink } from './nav-functions.svelte.js';

	let { links = [], link_attributes, children, ...nav_attributes }: NavigationProps = $props();

	// Close any open dialog elements before navigating.
	beforeNavigate(() => {
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
<nav role="navigation" {...nav_attributes}>
	{#each links as nav_link, i}
		{@const attributes = Array.isArray(link_attributes) ? link_attributes[i] : link_attributes}
		<NavLink {nav_link} {...attributes} />
	{/each}
	{@render children?.()}
</nav>

<style>
	nav {
		display: var(--nav-display, flex);
		flex-wrap: var(--nav-flex-wrap, wrap);
		align-items: var(--nav-align-items, center);
		justify-content: var(--nav-justify-content, center);
		margin: var(--nav-margin, 1rem auto);
		max-width: var(--nav-max-width, max-content);
		gap: var(--nav-gap, 1rem);
	}
</style>
