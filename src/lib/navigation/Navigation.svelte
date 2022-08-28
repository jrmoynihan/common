<script lang="ts">
	import type { TooltipParameters } from '../tooltip/tooltip-action.js';
	import NavItem from './NavItem.svelte';

	/** A list of strings to join to the parent path to make a complete link.  (e.g. parent path: '/home', links: ['interests', 'books']
	 * directs the user to /home/interests and /home/books)*/
	export let links: string[] = [];
	/** The path prefix for all links in this navigation component */
	export let parent_path = '/';
	/** Styles for the <nav> parent element */
	export let static_styles = '';
	/** Styles to pass to the individual nav links */
	export let nav_link_static_styles = '';
	/** The tooltip options for all parameters, or an array of tooltip options.  Each item of the options array will be passed into each respective nav item.*/
	export let tooltip_options: TooltipParameters | TooltipParameters[] = { disabled: true };
</script>

<nav style={static_styles}>
	{#each links as link, i}
		<NavItem
			bind:parent_path
			bind:tooltip_options
			bind:link
			{i}
			static_styles={nav_link_static_styles}
		/>
	{/each}
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
