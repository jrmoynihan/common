<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { should_layout_transition_on_navigation } from '#navigation/nav-functions.svelte.js';
	import Navigation from '#navigation/Navigation.svelte';
	import TransitionRunes from '#wrappers/Transition_Runes.svelte';
	import type { Snippet } from 'svelte';

	interface LayoutProps {
		children: Snippet;
	}

	let { children }: LayoutProps = $props();

	let trigger: boolean = $state(false);
	beforeNavigate(async (nav) => {
		if (nav.shallow) return;

		const { from, to } = nav;

		if (
			from &&
			to &&
			(await should_layout_transition_on_navigation({
				from,
				to,
				layout_parent_path: import.meta.url
			}))
		) {
			trigger = !trigger;
		}
	});
</script>

<section>
	<Navigation />

	<TransitionRunes bind:trigger>
		{@render children()}
	</TransitionRunes>
</section>
