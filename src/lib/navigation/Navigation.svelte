<script lang="ts">
	import type { TooltipParameters } from '$lib/tooltip/tooltip-action.js';
	import NavLink from '$lib/navigation/NavLink.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { NavigationLink } from './nav-functions.js';
	import { dynamicStyle } from '$lib/actions/dynamic-styles.js';

	/** An array of items to display within the nav wrapper element */
	export let nav_links: NavigationLink[] = [];
	/** Styles for the <nav> parent element */
	export let styles = '';
	/** Hover styles for the <nav> parent element */
	export let hover_styles = '';
	/** Focus styles for the <nav> parent element */
	export let focus_styles = hover_styles;
	/** Styles to pass to the individual nav links */
	export let nav_link_styles = '';
	/** Hover styles to pass to the individual nav links */
	export let nav_link_hover_styles: string = '';
	/** Focus syles to pass to the individual nav links */
	export let nav_link_focus_styles: string = '';
	/** The tooltip options for all parameters, or an array of tooltip options.  Each item of the options array will be passed into each respective nav item.*/
	export let tooltip_options: TooltipParameters | TooltipParameters[] = { disabled: true };

	// Close any open dialog elements before navigating.
	beforeNavigate(() => {
		if (browser) {
			const dialogs = document.getElementsByTagName('dialog');
			if (dialogs.length > 0) {
				for (const dialog of dialogs) {
					dialog.close();
				}
			}
		}
	});
</script>

<nav use:dynamicStyle={{ styles, hover_styles, focus_styles }}>
	{#each nav_links as nav_link, i}
		<NavLink
			bind:tooltip_options
			{...nav_link}
			{i}
			styles={nav_link_styles}
			hover_styles={nav_link_hover_styles}
			focus_styles={nav_link_focus_styles}
		/>
	{/each}
	<slot />
</nav>

<style lang="scss">
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem auto;
		max-width: max-content;
		gap: 1rem;
	}
</style>
