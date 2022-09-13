<script lang="ts">
	import { page } from '$app/stores';
	import { tooltip, type TooltipParameters } from '$lib/tooltip';
	import { capitalize } from '$lib/functions';
	import { Fa, FaLayers, FaLayersText } from 'svelte-fa/src';
	import type { IconLayer } from './nav-functions';
	import { goto } from '$app/navigation';

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
	export let static_styles: string = '';
	/** Styles to apply to a link when it is the active page URL. */
	export let current_page_styles: [string, string][] = [];
	/** Hover styles to apply to the links. */
	export let hover_styles: [string, string][] = [];
	/** Focus styles to apply to the links. */
	export let focus_styles: [string, string][] = [];
	/** Pass in an array of icons to use in a FaLayer component. */
	export let icons: IconLayer[] | null = null;

	let anchor: HTMLAnchorElement;
	let styles = static_styles;
	let hovered = false;
	let focused = false;

	// Determine if the current path matches a given path string
	function doesPathMatchCurrentURL(path: string, currentURL: string) {
		return currentURL.includes(`${path}`);
	}

	function scrollIntoView(e: MouseEvent & { currentTarget: EventTarget & HTMLElement }): void {
		//@ts-ignore
		const href: string = e.target?.getAttribute('href');
		if (href) {
			const el = document?.getElementById(href.split('#')[1]);
			if (el) {
				el?.scrollIntoView({
					behavior: 'smooth'
				});
			} else {
				goto(href);
			}
		}
	}

	$: is_current_page = doesPathMatchCurrentURL(url.href, $page?.url?.href);
	$: {
		if (anchor && current_page_styles?.length > 0 && is_current_page) {
			current_page_styles.forEach(([key, value]) => {
				anchor?.style.setProperty(key, value);
			});
		} else {
			current_page_styles?.forEach(([key, value]) => {
				anchor?.style.removeProperty(key);
			});
			// Re-apply styles that should stay
			styles = static_styles;
		}
	}
	$: {
		if (anchor && hover_styles?.length > 0 && hovered) {
			hover_styles.forEach(([key, value]) => {
				anchor?.style.setProperty(key, value);
			});
		} else {
			hover_styles?.forEach(([key, value]) => {
				anchor?.style.removeProperty(key);
			});
			// Re-apply styles that should stay
			styles = static_styles;
		}
	}
	$: {
		if (anchor && focus_styles?.length > 0 && focused) {
			focus_styles.forEach(([key, value]) => {
				anchor?.style.setProperty(key, value);
			});
		} else {
			focus_styles?.forEach(([key, value]) => {
				anchor?.style.removeProperty(key);
			});
			// Re-apply styles that should stay
			styles = static_styles;
		}
	}
</script>

<a
	bind:this={anchor}
	use:tooltip={Array.isArray(tooltip_options) ? tooltip_options[i] : tooltip_options}
	href={url.href}
	data-sveltekit-prefetch
	class="link"
	class:current-page={is_current_page}
	style={styles}
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:focus={() => (focused = true)}
	on:blur={() => (focused = false)}
	on:click|preventDefault={scrollIntoView}
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
