<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { makeNavLinks, shouldLayoutTransitionOnNavigation } from '$navigation/nav-functions.js';
	import Navigation from '$navigation/Navigation.svelte';
	import Transition from '$wrappers/Transition.svelte';
	import { fly } from 'svelte/transition';

	let refresh = false;
	const parent_path = 'wrappers';
	const paths: string[] = ['transition', 'accordion', 'modal', 'tabs'];

	beforeNavigate((nav) => {
		const { from, to } = nav;
		if (from && to && shouldLayoutTransitionOnNavigation(from, to, parent_path)) refresh = !refresh;
	});
</script>

<section>
	{#await makeNavLinks({ paths, parent_path }) then nav_links}
		<Navigation {nav_links} nav_link_styles={`color: white`} />
	{/await}

	<Transition
		bind:refresh
		in_transition={fly}
		out_transition={fly}
		in_transition_parameters={{ duration: 250, delay: 300, x: -100 }}
		out_transition_parameters={{ duration: 300, x: 100 }}
	>
		<slot />
	</Transition>
</section>

<style lang="scss">
	section {
		display: grid;
		grid-auto-rows: max-content;
		grid-template-columns: 1fr;
	}
</style>
