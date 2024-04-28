<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Navigation from '$navigation/Navigation.svelte';
	import { shouldLayoutTransitionOnNavigation } from '$navigation/nav-functions.js';
	import TransitionRunes from '$wrappers/Transition_Runes.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	

	// const paths: string[] = ['navigation', 'gallery', 'orderable-list'];
	interface LayoutProps {
		refresh: boolean;
		data: LayoutData;
		children: Snippet
	}

	let { data, children }: LayoutProps = $props();
	const { links } = data;
	let trigger: boolean = $state(false);
	beforeNavigate(async (nav) => {
		const { from, to } = nav;
		if (from && to && (await shouldLayoutTransitionOnNavigation({from, to, layout_parent_path: 'recipes' }))){
			trigger = !trigger;
		}
	});
</script>

<Navigation links={links} dynamic_link_styles={{ styles: `color: white` }} />

<TransitionRunes
	bind:trigger
>
	{@render children()}
</TransitionRunes>

<style lang="scss">
</style>
