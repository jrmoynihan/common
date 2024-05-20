<script context="module" lang="ts">
	export interface NavigationProps extends HTMLAttributes<HTMLElement> {
		/** Dynamic styles for the <nav> parent element that will be applied on hover, focus, and active states, and base styles that will be re-applied when those states are lost. */
		dynamic_styles?: DynamicStyleParameters,
		/** Dynamic styles to the individual nav links that will be applied on hover, focus, and active states, and base styles that will be re-applied when those states are lost. */
		dynamic_link_styles?: DynamicStyleParameters | DynamicStyleParameters[],
		/** An array of items to display within the nav wrapper element.  You can provide links here or manually create `<NavLink>` components and provide them to the `children` snippet.  */
		links?: NavigationLink[],
		/** Classes to apply to the <a> elements. */
		link_classes?: string | string[],
		/** Attributes to apply to the <a> elements. */
		link_attributes?: HTMLAnchorAttributes | HTMLAnchorAttributes[],
		/** Styles to apply to the link if it is part of the current page path */
		link_current_page_styles?: string,
		/** The tooltip options for all parameters, or an array of tooltip options.  Each item of the options array will be passed into each respective nav item.*/
		tooltip_options?: TooltipProps | TooltipProps[],
		/** A snippet to render as the children of the <nav> element.*/
		children?: Snippet
	}
</script>

<script lang="ts">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import type { TooltipProps } from '$actions/tooltip/tooltip.svelte.js';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import NavLink from '$navigation/NavLink.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import type { NavigationLink } from './nav-functions.js';


	let {
		dynamic_styles,
		dynamic_link_styles,
		links = [],
		link_classes,
		link_attributes,
		link_current_page_styles,
		tooltip_options = { disabled: true },
		children,
		...nav_attributes
	} : NavigationProps = $props()

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

<!-- svelte-ignore a11y-no-redundant-roles -->
<nav 
	role="navigation"
	use:dynamic_style={dynamic_styles}
	{...nav_attributes}
>
	{#if links?.length > 0}
		{#each links as nav_link, i}
			{@const link_tooltip_options = Array.isArray(tooltip_options) ? tooltip_options[i] : tooltip_options}
			{@const link_dynamic_styles = Array.isArray(dynamic_link_styles) ? dynamic_link_styles[i] : dynamic_link_styles}
			{@const link_class = Array.isArray(link_classes) ? link_classes[i] : link_classes}
			{@const attributes = Array.isArray(link_attributes) ? link_attributes[i] : link_attributes}
			<NavLink
				{nav_link}
				current_page_styles={link_current_page_styles}
				tooltip_options={link_tooltip_options}
				dynamic_styles={link_dynamic_styles}
				classes={link_class}
				anchor_attributes={attributes}	
			/>
		{/each}
	{/if}
	{#if children}
		{@render children()}
	{/if}
</nav>

<style lang="scss">
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
