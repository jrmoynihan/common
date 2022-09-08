<script lang="ts">
	import { makeNavLinks, NavigationLink } from '$lib/navigation/navLink';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import { beforeNavigate } from '$app/navigation';
	import Transition from '$lib/wrappers/Transition.svelte';
	import { fly } from 'svelte/transition';

	let refresh: boolean = false;
	const parent_path: string = 'recipes';
	const paths: string[] = ['navigation', 'gallery'];
	const nav_links: NavigationLink[] = makeNavLinks(paths, parent_path);

	beforeNavigate((nav) => {
		const { from, to } = nav;
		if (from?.routeId === to?.routeId) return;
		refresh = !refresh;
	});
</script>

<Navigation {nav_links} />

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
