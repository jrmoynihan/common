```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import type { NavigationLink } from '$lib';
	import Transition from '$lib/wrappers/Transition.svelte';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import { makeNavLinks, shouldLayoutTransitionOnNavigation } from '$lib/navigation/nav-functions';
	import { fly } from 'svelte/transition';

	let refresh: boolean = false;
	const parent_path: string = 'recipes'
	const paths: string[] = ['navigation', 'gallery'];
	const nav_links: NavigationLink[] = makeNavLinks({ paths, parent_path });

	beforeNavigate(({from, to}) => {
		if (from && to && shouldLayoutTransitionOnNavigation(from, to, parent_path)){
			refresh = !refresh;
		}
	});
</script>

<section>
	<Navigation {nav_links} />

	<Transition
		bind:refresh
		in_transition={fly}
		out_transition={fly}
		in_transition_parameters={{ duration: 350, delay: 400, x: -100 }}
		out_transition_parameters={{ duration: 400, x: 100 }}
	>
		<slot />
	</Transition>
</section>
```