<script lang="ts">
	import '../app.css';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import LightDarkToggleV2 from '$buttons/LightDarkToggle_v2.svelte';
	import Navigation from '$navigation/Navigation.svelte';
	import { should_layout_transition_on_navigation } from '$navigation/nav-functions.js';
	import FunctionsAside from '$routes/functions/FunctionsAside.svelte';
	import TransitionRunes from '$wrappers/Transition_Runes.svelte';
	import { type Snippet } from 'svelte';
	import '../../src/mdsvex.css';
	import type { LayoutData } from './$types';
	import { aside_visible } from './stores.svelte.js';

	type LayoutProps = { data: LayoutData; children: Snippet };

	let { data, children }: LayoutProps = $props();
	const { nav_links } = data;
	let trigger: boolean = $state(false);

	beforeNavigate(async (nav) => {
		const { from, to } = nav;

		if (
			from &&
			to &&
			(await should_layout_transition_on_navigation({ from, to, layout_parent_path: '/' }))
		) {
			trigger = !trigger;
		}
	});
</script>

<div class="app-container" class:padded-left={$aside_visible}>
	<div class="top right">
		<LightDarkToggleV2 />
	</div>
	<h1>
		<a href="/" class="cool-text">The Commons</a>
	</h1>
	<Navigation
		links={nav_links}
		link_current_page_styles="color: white"
		dynamic_link_styles={{
			styles: `color: white`,
			hover_styles: 'background: darkorange'
		}}
	/>
	<main>
		<TransitionRunes bind:trigger>
			{@render children()}
		</TransitionRunes>
	</main>
	{#if page.url.pathname.includes('/functions')}
		<FunctionsAside />
	{/if}
</div>

<!-- <SvelteToast /> -->

<style lang="scss">
	:root {
		font-family:
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		background-color: var(--background);
		color: var(--text);
		--tooltip-color: black;
		--tooltip-font-weight: 400;
		--tooltip-font-size: 12px;
		--link-font-size: 1.5rem;
		--link-border-radius: 2rem;
		--link-background-color: hsl(195, 61%, 34%);
		--link-background-value: 195, 61%, 34%;
		--link-hover-box-shadow: 0 0 4px 1px orange;
		--link-hover-background-color: hsl(195, 61%, 44%);
		--current-nav-page-box-shadow: 0 0 14px 4px orange;
		--current-nav-page-background-color: hsl(195, 61%, 44%);
		--orange: hsla(39, 100%, 50%, 1);
		--spinner-background: var(--orange);
		--spinner-color: black;
	}

	.app-container {
		display: grid;
		grid-template-columns: minmax(0, 1fr); // prevent overflow;
		transition: padding-left 400ms ease-out;
		will-change: padding-left;
	}
	.padded-left {
		padding-left: 15vw;
	}
	.top {
		position: fixed;
		top: 0;
		padding: 1rem;
		z-index: 1;
	}
	.right {
		right: 0;
	}
	h1 {
		margin: 2rem auto;
		max-width: max-content;
		font-style: italic;
		font-weight: 800;
		font-size: 5vh;
		font-family: 'Fira Code iScript';
		text-align: center;
	}
	main {
		display: flex;
		place-items: center;
		justify-content: center;
	}
	.cool-text {
		display: inline-flex;
		color: var(--accent, orange);
		text-decoration: underline;
		transition: background-color 0.2s ease-in-out;
		padding: 0.5rem;
		border-radius: 1rem;
		&:hover,
		&:focus-visible {
			background-color: hsl(195, 61%, 34%);
			color: white;
		}
	}
</style>
