<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import {
		make_subroute_nav_links,
		should_layout_transition_on_navigation
	} from '#navigation/nav-functions.svelte.js';
	import Navigation from '#navigation/Navigation.svelte';
	import TransitionRunes from '#wrappers/Transition_Runes.svelte';
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
		if (nav.shallow) return;

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
	{#await make_subroute_nav_links(data.url) then nav_links}
		<Navigation links={nav_links} />
	{/await}

	<TransitionRunes bind:trigger>
		{@render children()}
	</TransitionRunes>
</section>
