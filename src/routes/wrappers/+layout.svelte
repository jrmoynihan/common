<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Navigation from '$navigation/Navigation.svelte';
	import {
		make_subroute_nav_links,
		should_layout_transition_on_navigation
	} from '$navigation/nav-functions.svelte.js';
	import TransitionRunes from '$wrappers/Transition_Runes.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let trigger = $state(false);
	const { url } = data;

	beforeNavigate(async (nav) => {
		const { from, to } = nav;
		if (
			from &&
			to &&
			(await should_layout_transition_on_navigation({ from, to, layout_parent_path: 'wrappers' }))
		) {
			trigger = !trigger;
		}
	});
</script>

<section>
	{#await make_subroute_nav_links(url) then nav_links}
		<Navigation links={nav_links} />
	{/await}

	<TransitionRunes bind:trigger>
		{@render children?.()}
	</TransitionRunes>
</section>

<style>
	section {
		display: grid;
		grid-auto-rows: max-content;
		grid-template-columns: minmax(0, 1fr);
	}
</style>
