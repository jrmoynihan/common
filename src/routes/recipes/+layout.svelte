<script lang="ts">
	import {
		makeNavLinks,
		NavigationLink,
		shouldLayoutTransitionOnNavigation
	} from '$lib/navigation/nav-functions';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import { beforeNavigate } from '$app/navigation';
	import Transition from '$lib/wrappers/Transition.svelte';
	import { fly } from 'svelte/transition';

	let refresh: boolean = false;
	const parent_path: string = 'recipes';
	const paths: string[] = ['navigation', 'gallery', 'orderable-list'];
	const nav_links: NavigationLink[] = makeNavLinks({ paths, parent_path });

	beforeNavigate(({ from, to }) => {
		if (from && to && shouldLayoutTransitionOnNavigation(from, to, parent_path)) refresh = !refresh;
	});
</script>

<Navigation {nav_links} nav_link_static_styles={`color: white`} />

<Transition
	bind:refresh
	in_transition={fly}
	out_transition={fly}
	in_transition_parameters={{ duration: 250, delay: 300, x: -100 }}
	out_transition_parameters={{ duration: 300, x: 100 }}
>
	<slot />
</Transition>

<style lang="scss">
</style>
