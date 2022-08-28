<script lang="ts">
	import Transition from '$lib/wrappers/Transition.svelte';
	import { fly } from 'svelte/transition';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import { beforeNavigate } from '$app/navigation';

	let refresh: boolean = false;
	const links: string[] = ['transition', 'accordion', 'modal', 'tabs'];
	const parent_path = '/wrappers';

	beforeNavigate(async (nav) => {
		const { from, to } = nav;
		if (from?.pathname === to?.pathname) return;
		if (from?.pathname && to?.pathname) {
			const from_path_segments = from.pathname.split('/');
			const to_path_segments = to.pathname.split('/');
			const last_from_segment = from_path_segments.length - 1;
			const last_to_segment = to_path_segments.length - 1;
			console.log(
				'from:',
				from_path_segments[last_from_segment],
				'to:',
				to_path_segments[last_to_segment]
			);
			if (from_path_segments[2] !== to_path_segments[2]) {
				refresh = !refresh;
			}
		}
	});
</script>

<section>
	<Navigation {links} {parent_path} />

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

<style lang="scss">
	section {
		display: grid;
		grid-auto-rows: max-content;
		grid-template-columns: 1fr;
	}
</style>
