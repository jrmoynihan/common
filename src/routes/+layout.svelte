<script lang="ts">
	import { dev } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import type { TooltipParameters } from '$lib';
	import LightDarkToggle from '$lib/buttons/LightDarkToggle.svelte';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import Transition from '$lib/wrappers/Transition.svelte';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { use_dark_theme } from './stores';
	import '../../src/mdsvex.css';
	import { makeNavLinks, NavigationLink } from '$lib/navigation/navLink';

	const coords = writable({ x: 0, y: 0 });
	const paths: string[] = ['tooltips', 'inputs', 'buttons', 'wrappers', 'recipes'];
	const nav_links: NavigationLink[] = makeNavLinks(paths);
	let refresh: boolean = false;
	let tooltips_visible = true;
	let tooltips_disabled = false;

	const delay_tips = (i: number) => {
		return (i + 1) * 100 + 100;
	};
	let tooltip_words = ['Click', 'on a link', 'to explore', 'the cool stuff', 'available!'];
	const getTitleSegment = (i: number) => {
		return tooltip_words[i];
	};
	const assignTooltips = () =>
		tooltip_words.map((word, i) => {
			const delay = delay_tips(i);
			const title = getTitleSegment(i);
			return {
				visible: tooltips_visible,
				disabled: tooltips_disabled,
				delay,
				title
			};
		});
	let link_tooltip_options: TooltipParameters[] = assignTooltips();

	const disableTooltips = () => {
		const new_options = link_tooltip_options.map((tooltip) => {
			const { ...existing_options } = tooltip;
			return { ...existing_options, visible: false, disabled: true };
		});
		// Trigger reactive update
		link_tooltip_options = [...new_options];
	};

	beforeNavigate((nav) => {
		const { from, to } = nav;
		if (from?.pathname === to?.pathname) return;
		if (from?.pathname && to?.pathname) {
			const from_path_segments = from.pathname.split('/');
			const to_path_segments = to.pathname.split('/');
			if (from_path_segments[1] !== to_path_segments[1]) {
				refresh = !refresh;
			}
		}
		disableTooltips();
	});
	const countdown = setTimeout(() => {
		disableTooltips();
		console.log('ran countdown');
	}, 5_000);

	onDestroy(() => clearTimeout(countdown));
</script>

<svelte:window on:mousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })} />
{#if dev}
	<div class="top left" class:dark={$use_dark_theme} style="color:var(--accent,orange)">
		<p>X: {$coords.x}</p>
		<p>Y: {$coords.y}</p>
	</div>
{/if}
<div class="top right">
	<LightDarkToggle bind:use_dark_theme={$use_dark_theme} />
</div>
<h1>
	<a href="/" sveltekit:prefetch class="cool-text">The Commons</a>
</h1>
<Navigation {nav_links} bind:tooltip_options={link_tooltip_options} />
<main>
	<Transition
		bind:refresh
		transition={fly}
		in_transition_parameters={{ duration: 400, x: -100, delay: 450 }}
		out_transition_parameters={{ duration: 400, x: 100 }}
	>
		<slot />
	</Transition>
</main>

<style lang="scss">
	:root {
		font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', -apple-system,
			BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background-color: var(--background, hsl(195, 61%, 14%));
		color: var(--text, white);
		--tooltip-color: black;
		--tooltip-font-weight: 400;
		--tooltip-font-size: 12px;
	}
	.top {
		position: fixed;
		top: 0;
		padding: 1rem;
	}
	.left {
		left: 0;
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
