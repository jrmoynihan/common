<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import LightDarkToggleV2 from '#buttons/LightDarkToggle_v2.svelte';
	import Navigation from '#navigation/Navigation.svelte';
	import { should_layout_transition_on_navigation } from '#navigation/nav-functions.svelte.js';
	import FunctionsAside from '#routes/functions/FunctionsAside.svelte';
	import TransitionRunes from '#wrappers/Transition_Runes.svelte';
	import type { IconProps } from '@iconify/svelte';
	import { type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import '../../src/mdsvex.css';
	import '../app.css';
	import { aside_visible } from './stores.svelte.js';

	type LayoutProps = { children: Snippet };

	let { children }: LayoutProps = $props();
	const icon_map = new Map<string, IconProps>([
		['buttons', { icon: 'fa6-solid:computer-mouse' }],
		['functions', { icon: 'fa6-solid:calculator' }],
		['inputs', { icon: 'fa6-solid:keyboard' }],
		['recipes', { icon: 'fa6-solid:receipt' }],
		['tooltips', { icon: 'material-symbols:tooltip-outline' }],
		['wrappers', { icon: 'carbon:container-software' }]
	]);
	let trigger: boolean = $state(false);
	let dark_mode = new MediaQuery('(prefers-color-scheme: dark)');
	let bg_color: string = $state(dark_mode.current ? '#0e2f39' : '#ffffff');
	let accent_color: string = $state(dark_mode.current ? '#ffa600' : '#ffa600');

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

	function handle_bg_color_change(e: Event) {
		const color = (e.target as HTMLInputElement).value;
		dark_mode.current &&
		getComputedStyle(document.documentElement).getPropertyValue('--dark-background')
			? document.documentElement.style.setProperty('--dark-background', color)
			: document.documentElement.style.setProperty('--background', color);
	}

	function handle_accent_color_change(e: Event) {
		const color = (e.target as HTMLInputElement).value;
		dark_mode.current &&
		getComputedStyle(document.documentElement).getPropertyValue('--dark-background')
			? document.documentElement.style.setProperty('--dark-accent', color)
			: document.documentElement.style.setProperty('--accent', color);
	}
</script>

<div class="app-container" class:padded-left={$aside_visible}>
	<div class="top right flex flex-col place-items-center gap-2">
		<LightDarkToggleV2 />
		<input type="color" bind:value={bg_color} oninput={handle_bg_color_change} />
		<input type="color" bind:value={accent_color} oninput={handle_accent_color_change} />
	</div>
	<h1>
		<a href="/" class="cool-text">The Commons</a>
	</h1>
	<Navigation {icon_map} />
	<main>
		<TransitionRunes bind:trigger>
			{@render children?.()}
		</TransitionRunes>
	</main>
	{#if page.url.pathname.includes('/functions')}
		<FunctionsAside />
	{/if}
</div>

<style>
	input[type='color'] {
		width: 35px;
		height: 100%;
		place-self: center;
		display: flex;
	}
	input[type='color' i]::-webkit-color-swatch-wrapper {
		border-radius: 100%;
		aspect-ratio: 1 / 1;
	}
	input[type='color' i]::-webkit-color-swatch {
		border-radius: 100%;
	}
	.app-container {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
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
		font-style: italic;
		font-weight: 800;
		font-family:
			'Fira Code iScript', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue',
			'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif;
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
