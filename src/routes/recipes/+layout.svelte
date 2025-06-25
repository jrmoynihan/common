<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { should_layout_transition_on_navigation } from '$navigation/nav-functions';
	import Navigation from '$navigation/Navigation.svelte';
	import TransitionRunes from '$wrappers/Transition_Runes.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	// const paths: string[] = ['navigation', 'gallery', 'orderable-list'];
	interface LayoutProps {
		refresh: boolean;
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: LayoutProps = $props();

	let trigger: boolean = $state(false);
	beforeNavigate(async (nav) => {
		const { from, to } = nav;
		if (
			from &&
			to &&
			(await should_layout_transition_on_navigation({ from, to, layout_parent_path: 'recipes' }))
		) {
			trigger = !trigger;
		}
	});
</script>

<section>
	<Navigation links={data.links} />

	<TransitionRunes bind:trigger>
		{@render children()}
	</TransitionRunes>
</section>
