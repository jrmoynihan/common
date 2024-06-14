<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Navigation from '$navigation/Navigation.svelte';
	import { shouldLayoutTransitionOnNavigation } from '$navigation/nav-functions.js';
	import TransitionRunes from '$wrappers/Transition_Runes.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData, children: Snippet } = $props();
	let trigger = $state(false);

	beforeNavigate(async (nav) => {
		const { from, to } = nav;
		if (from && to && (await shouldLayoutTransitionOnNavigation({from, to, layout_parent_path: 'wrappers'}))
		) {
			trigger = !trigger;
		}
	});
</script>

<section>
	<Navigation
		links={data.links}
		link_current_page_styles="color: white"
		dynamic_link_styles={{ styles: `color: white` }}
	/>

	<TransitionRunes bind:trigger>
		{@render children?.()}
	</TransitionRunes>
</section>

<style lang="scss">
	section {
		display: grid;
		grid-auto-rows: max-content;
		grid-template-columns: 1fr;
	}
</style>
