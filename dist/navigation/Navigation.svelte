<script>import { dynamicStyle } from '../actions/dynamic-styles.js';
import { browser } from '$app/environment';
import { beforeNavigate } from '$app/navigation';
import NavLink from './NavLink.svelte';
/** An array of items to display within the nav wrapper element */
export let nav_links = [];
/** Styles for the <nav> parent element */
export let styles = '';
/** Hover styles for the <nav> parent element */
export let hover_styles = '';
/** Focus styles for the <nav> parent element */
export let focus_styles = hover_styles;
/** Active styles for the <nav> parent element*/
export let active_styles = '';
/** Styles to pass to the individual nav links */
export let nav_link_styles = '';
/** Hover styles to pass to the individual nav links */
export let nav_link_hover_styles = '';
/** Focus syles to pass to the individual nav links */
export let nav_link_focus_styles = '';
/** Active styles to pass to the individual nav links */
export let nav_link_active_styles = '';
/** Styles to apply to the link if it is part of the current page path */
export let nav_link_current_page_styles = '';
/** The tooltip options for all parameters, or an array of tooltip options.  Each item of the options array will be passed into each respective nav item.*/
export let tooltip_options = { disabled: true };
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

<nav use:dynamicStyle={{ styles, hover_styles, focus_styles, active_styles }}>
	{#each nav_links as nav_link, i}
		<NavLink
			bind:tooltip_options
			{i}
			{nav_link}
			styles={nav_link_styles}
			hover_styles={nav_link_hover_styles}
			focus_styles={nav_link_focus_styles}
			active_styles={nav_link_active_styles}
			current_page_styles={nav_link_current_page_styles}
		/>
	{/each}
	<slot />
</nav>

<style>nav {
  display: var(--nav-display, flex);
  flex-wrap: var(--nav-flex-wrap, wrap);
  align-items: var(--nav-align-items, center);
  justify-content: var(--nav-justify-content, center);
  margin: var(--nav-margin, 1rem auto);
  max-width: var(--nav-max-width, max-content);
  gap: var(--nav-gap, 1rem);
}</style>
