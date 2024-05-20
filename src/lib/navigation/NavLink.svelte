<script lang="ts">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import { tooltip, type TooltipProps } from '$actions/tooltip/tooltip.svelte.js';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Fa, FaLayers, FaLayersText } from '@jrmoynihan/svelte-fa';
	import type { ComponentProps } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { NavigationLink } from './nav-functions.js';

	interface NavLinkProps {
		/** The navigation link to display. */
		nav_link: NavigationLink;
		/** Tooltip options to apply to the nav links. */
		tooltip_options?: TooltipProps;
		/** Attributes for an `<a>` element. */
		anchor_attributes?: HTMLAnchorAttributes;
		/** Classes to apply to the nav links. */
		classes?: string;
		/** Styles to apply to a link when it is the _currently active_ page URL. */
		current_page_styles?: string;
		/** Dynamic styles to apply to the nav links. */
		dynamic_styles?: DynamicStyleParameters;
		/** Props for an `<FaLayers>` component */
		fa_layers_props?: ComponentProps<FaLayers>;
	}

	let {
		nav_link,
		tooltip_options = { disabled: true, visible: false },
		anchor_attributes,
		classes,
		current_page_styles,
		dynamic_styles,
		fa_layers_props
	}: NavLinkProps = $props();

	let is_current_page = $derived(nav_link.isCurrentPage($page));
	let anchor_path_to_scroll_to: string | undefined = $state();

	beforeNavigate(({ from, to, cancel }) => {
		const href = to?.url?.href;
		if (href !== nav_link.url.href) return;
		if (href) {
			const is_anchor = href.includes('#');
			const path_segments = href.split('#');
			const base_path = path_segments[0];
			anchor_path_to_scroll_to = path_segments[1];
			const is_same_base_path = to?.route.id === from?.route.id;
			if (is_same_base_path && is_anchor) {
				cancel();
				scrollToElement();
			} else if (is_anchor) {
				cancel();
				// Navigate to the base path, then allow the afterNavigate hook to move to the anchor smoothly
				goto(base_path);
			}
		}
	});
	afterNavigate(({ to }) => {
		if (to && !nav_link.url.href.includes(to.url.href)) return;
		if (anchor_path_to_scroll_to) {
			scrollToElement();
		}
	});
	function scrollToElement() {
		if (anchor_path_to_scroll_to === undefined) return;
		const el = document?.getElementById(anchor_path_to_scroll_to);
		if (el) {
			el?.scrollIntoView({
				behavior: 'smooth'
			});
		}
		anchor_path_to_scroll_to = '';
	}
</script>

<a
	data-sveltekit-preload-data="hover"
	use:tooltip={tooltip_options}
	use:dynamic_style={{
		...dynamic_styles,
		styles: is_current_page ? current_page_styles : dynamic_styles?.styles
	}}
	class={`link ${classes ?? ''}`}
	class:current={is_current_page}
	href={nav_link.url.href}
	{...anchor_attributes}
>
	{#if Array.isArray(nav_link.icons) && nav_link.icons.length > 0}
		<FaLayers {...fa_layers_props}>
			{#each nav_link.icons as { icon, translateX, translateY, color, text, size, scale, style }}
				{#if icon}
					<Fa {icon} {size} {translateX} {translateY} {color} {scale} {style} />
				{:else if text}
					<FaLayersText {translateX} {translateY} {color} {scale} {style}>
						{text}
					</FaLayersText>
				{/if}
			{/each}
		</FaLayers>
	{/if}
	{nav_link.link_text}
</a>

<style lang="scss">
	@layer navlink {
		.link {
			font-family: var(--link-font, var(--font, inherit));
			text-decoration: var(--link-text-decoration, none);
			font-size: var(--link-font-size, 1rem);
			padding: var(--link-padding, 1rem);
			color: var(--link-color, var(--text, inherit));
			border-radius: var(--link-border-radius, 1rem);
			background-color: var(--link-background-color);
			transition: var(--link-transition, all 200ms ease-in-out);
			&:hover,
			&:focus-visible {
				background-color: var(--link-hover-background-color);
				color: var(--link-hover-color);
				box-shadow: var(--link-hover-box-shadow);
			}
			&.current {
				box-shadow: var(--current-nav-page-box-shadow);
				background-color: var(--current-nav-page-background-color);
				color: var(--current-nav-page-color);
			}
		}
	}
</style>
