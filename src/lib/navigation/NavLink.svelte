<script module lang="ts">
	export interface NavLinkProps extends HTMLAnchorAttributes {
		/** The navigation link to display. */
		nav_link: NavigationLink;
		/** Styles to apply to a link when it is the _currently active_ page URL. */
		current_page_styles?: string;
		/** The children snippet to render. */
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { NavigationLink } from './nav-functions.svelte.js';

	let { nav_link, current_page_styles, children, ...anchor_attributes }: NavLinkProps = $props();

	let anchor_path_to_scroll_to: string | undefined = $state();

	beforeNavigate(({ from, to, cancel }) => {
		const href = to?.url?.href;
		if (href !== nav_link.url?.href) return;
		if (href) {
			const is_anchor = href.includes('#');
			const path_segments = href.split('#');
			const base_path = path_segments[0];
			anchor_path_to_scroll_to = path_segments[1];
			const is_same_base_path = to?.route.id === from?.route.id;
			if (is_same_base_path && is_anchor) {
				cancel();
				scrollToElement();
			} else if (is_anchor && base_path) {
				cancel();
				// Navigate to the base path, then allow the afterNavigate hook to move to the anchor smoothly
				goto(base_path);
			}
		}
	});
	afterNavigate(({ to }) => {
		if (to && !nav_link.url?.href.includes(to.url.href)) return;
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

<!-- TODO: convert/merge dynamic styles to a single attachment using $derived state to trigger style updates -->
<a
	data-sveltekit-preload-data="hover"
	href={nav_link.url?.href}
	{...anchor_attributes}
	class={[
		'_link',
		anchor_attributes.class,
		nav_link.is_current_page && '_current',
		nav_link.is_page_in_path && '_active-path'
	]}
>
	{#if nav_link.icon_props}
		<Icon {...nav_link.icon_props} />
	{/if}
	{@render children?.()}
	{nav_link.link_text}
</a>

<style>
	@layer common.navlink {
		._link {
			font-family: var(--link-font, var(--font, inherit));
			text-decoration: var(--link-text-decoration, none);
			font-size: var(--link-font-size, var(--font-size-fluid-1, 1rem));
			padding: var(--link-padding, 1rem);
			color: var(--link-color, var(--text, inherit));
			border-radius: var(--link-border-radius, 1rem);
			background-color: var(--link-background-color);
			transition: var(--link-transition, all 200ms ease-in-out);
			&:hover,
			&:focus-visible {
				background-color: var(--link-hover-background-color);
				color: var(--link-hover-color, var(--link-color, var(--text, inherit)));
				box-shadow: var(--link-hover-box-shadow);
			}
			&._current {
				box-shadow: var(--current-nav-page-box-shadow);
				background-color: var(
					--current-nav-page-background-color,
					var(--link-color, var(--text, inherit))
				);
				color: var(--current-nav-page-color, var(--link-color, var(--text, inherit)));
			}
			&._active-path {
				box-shadow: var(--current-nav-page-box-shadow);
				background-color: var(
					--current-nav-page-background-color,
					var(--link-color, var(--text, inherit))
				);
				color: var(--current-nav-page-color, var(--link-color, var(--text, inherit)));
			}
		}
	}
</style>
