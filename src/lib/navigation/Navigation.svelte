<script lang="ts">
	import type { TooltipParameters } from '$lib/tooltip';
	import NavItem from '$lib/navigation/NavLink.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { NavigationLink } from './navLink';

	/** A list of strings to join to the parent path to make a complete link.  (e.g. parent path: '/home', links: ['interests', 'books']
	 * directs the user to /home/interests and /home/books)*/
	export let nav_links: NavigationLink[] = [];
	/** Styles for the <nav> parent element */
	export let static_styles = '';
	/** Styles to pass to the individual nav links */
	export let nav_link_static_styles = '';
	/** The tooltip options for all parameters, or an array of tooltip options.  Each item of the options array will be passed into each respective nav item.*/
	export let tooltip_options: TooltipParameters | TooltipParameters[] = { disabled: true };

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

<nav style={static_styles}>
	{#each nav_links as nav_link, i}
		<NavItem bind:tooltip_options {...nav_link} {i} static_styles={nav_link_static_styles} />
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
