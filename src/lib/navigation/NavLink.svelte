<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import { tooltip, type TooltipParameters } from '$actions/tooltip/tooltip.js';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { capitalize } from '$functions/helpers.js';
	import { Fa, FaLayers, FaLayersText } from '@jrmoynihan/svelte-fa';
	import type { IconLayer } from './nav-functions.js';

	/** The URL object describing the link */
	export let url: URL;
	/** The displayed text for the link (defaults to the link's pathname)*/
	export let link_text: string = capitalize(url.pathname);
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
	/** Pass in an array of icons to use in a FaLayer component. */
	export let icons: IconLayer[] | null = null;
	/** Is the link hovered? */
	export let hovered = false;
	/** Is the link focused? */
	export let focused = false;

	let anchor_path_to_scroll_to: string;

	// Determine if the current path matches a given path string
	function doesPathMatchCurrentURL(path: string, currentURL: string) {
		return currentURL.includes(`${path}`);
	}

	beforeNavigate(({ from, to, cancel }) => {
		const href = to?.url?.href;
		if (href !== url.href) return;
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
		if (to && !url.href.includes(to.url.href)) return;
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

	$: is_current_page = doesPathMatchCurrentURL(url.href, $page?.url?.href);
</script>

<a
	use:dynamicStyle={{
		styles: is_current_page ? current_page_styles : styles,
		hover_styles,
		focus_styles,
		active_styles
	}}
	use:tooltip={Array.isArray(tooltip_options) ? tooltip_options[i] : tooltip_options}
	href={url.href}
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
	{#if Array.isArray(icons) && icons.length > 0}
		<FaLayers>
			{#each icons as { icon, translateX, translateY, color, text, size, scale, style }}
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
	{link_text}
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
