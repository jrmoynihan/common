```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import Transition from '$lib/wrappers/Transition.svelte';
	import { fly } from 'svelte/transition';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import { beforeNavigate } from '$app/navigation';
	import type { NavigationLink } from '$lib';
	import { makeNavLinks } from '$lib/navigation/navLink';

	let refresh: boolean = false;
	const paths: string[] = ['transition', 'accordion', 'modal', 'tabs'];
	const parent_path: string = 'wrappers';
	const nav_links: NavigationLink[] = makeNavLinks(paths, parent_path);

	beforeNavigate((nav) => {
		const { from, to } = nav;
		if (from?.routeId === to?.routeId) return;
			refresh = !refresh;
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