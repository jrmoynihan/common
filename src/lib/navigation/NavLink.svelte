<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import { tooltip, type TooltipParameters } from '$actions/tooltip/tooltip.js';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Fa, FaLayers, FaLayersText } from '@jrmoynihan/svelte-fa';
	import type { NavigationLink } from './nav-functions.js';

	/** The entire Navlink instance */
	export let nav_link: NavigationLink;
	/** Tooltip options to apply to the nav links. If an array is passed, each options object will be applied to each link, individually.  Must pass the index in the array, `i` as well!  */
	export let tooltip_options: TooltipParameters | TooltipParameters[] = { disabled: true };
	/** Is the link the currently active page/url? */
	export let is_current_page: boolean = false;
	/** Index used to access tooltip options from an array */
	export let i: number = 0;
	/** Static styles to apply to the links. Will be re-applied when hover, focus, current-page status is lost*/
	export let styles: string = '';
	/** Styles to apply to a link when it is the active page URL. */
	export let current_page_styles: string = '';
	/** Hover styles to apply to the links. */
	export let hover_styles: string = '';
	/** Focus styles to apply to the links. */
	export let focus_styles: string = '';
	/** Active styles to apply to the links */
	export let active_styles: string = '';
	/** Is the link hovered? */
	export let hovered = false;
	/** Is the link focused? */
	export let focused = false;
	/** The tab index (only set if necessary!) */
	export let tabindex: number = 0;

	let anchor_path_to_scroll_to: string;

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
		const el = document?.getElementById(anchor_path_to_scroll_to);
		if (el) {
			el?.scrollIntoView({
				behavior: 'smooth'
			});
		}
		anchor_path_to_scroll_to = '';
	}

	$: if (nav_link.isCurrentPage && $page) is_current_page = nav_link.isCurrentPage($page);
</script>

<a
	use:dynamicStyle={{
		styles: is_current_page ? current_page_styles : styles,
		hover_styles,
		focus_styles,
		active_styles
	}}
	use:tooltip={Array.isArray(tooltip_options) ? tooltip_options[i] : tooltip_options}
	href={nav_link.url.href}
	{tabindex}
	data-sveltekit-preload-code
	class="link"
	class:current-page={is_current_page}
	style={styles}
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:focus={() => (focused = true)}
	on:blur={() => (focused = false)}
	on:click
>
	{#if Array.isArray(nav_link.icons) && nav_link.icons.length > 0}
		<FaLayers>
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
		&.current-page {
			box-shadow: var(--current-nav-page-box-shadow);
			background-color: var(--current-nav-page-background-color);
			color: var(--current-nav-page-color);
		}
	}
</style>
