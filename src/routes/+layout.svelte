<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import type { TooltipParameters } from '$lib/tooltip/tooltip-action.js';
	import LightDarkToggle from '$lib/buttons/LightDarkToggle.svelte';
	import Navigation from '$lib/navigation/Navigation.svelte';
	import Transition from '$lib/wrappers/Transition.svelte';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { use_dark_theme, aside_visible } from './stores.js';
	import '../../src/mdsvex.css';
	import {
		makeNavLinks,
		type IconLayer,
		shouldLayoutTransitionOnNavigation
	} from '$lib/navigation/nav-functions.js';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import {
		faCalculator,
		faGifts,
		faKeyboard,
		faReceipt,
		faTools,
		faComputerMouse
	} from '@fortawesome/free-solid-svg-icons/index';
	import { page } from '$app/stores';
	import FunctionsAside from './functions/FunctionsAside.svelte';
	import { reminderToast } from '$lib/index.js';

	const parent_path = '/';
	const paths: string[] = ['tooltips', 'inputs', 'buttons', 'wrappers', 'recipes', 'functions'];
	const link_icons: IconLayer[][] = [
		[{ icon: faTools }],
		[{ icon: faKeyboard }],
		[{ icon: faComputerMouse }],
		[{ icon: faGifts }],
		[{ icon: faReceipt }],
		[{ icon: faCalculator }]
	];
	let refresh: boolean = false;
	let tooltips_visible = true;
	let tooltips_disabled = false;

	const delay_tips = (i: number) => {
		return (i + 1) * 100 + 100;
	};
	let tooltip_words = ['Click', 'on a', 'link', 'to explore', 'the cool stuff', 'available!'];
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
		if (from && to && shouldLayoutTransitionOnNavigation(from, to, parent_path)) refresh = !refresh;
		disableTooltips();
	});

	const countdown = setTimeout(() => {
		disableTooltips();
	}, 5_000);

	setTimeout(
		() =>
			reminderToast({
				msg: 'this is a reminder',
				useSeenToastComponent: true,
				local_storage_key: 'toast-reminder-key'
			}),
		2000
	);
	onDestroy(() => clearTimeout(countdown));
</script>

<div class="app-container" class:padded-left={$aside_visible}>
	<div class="top right">
		<LightDarkToggle bind:use_dark_theme={$use_dark_theme} />
	</div>
	<h1>
		<a href="/" class="cool-text">The Commons</a>
	</h1>
	{#await makeNavLinks({ paths, link_icons }) then nav_links}
		<Navigation
			{nav_links}
			bind:tooltip_options={link_tooltip_options}
			nav_link_styles={`color: white`}
			nav_link_hover_styles={'background: darkorange'}
		/>
	{/await}
	<main>
		<Transition
			bind:refresh
			transition={fly}
			in_transition_parameters={{ duration: 350, x: -100, delay: 300 }}
			out_transition_parameters={{ duration: 350, x: 100 }}
		>
			<slot />
		</Transition>
	</main>
	{#if $page.url.pathname.includes('/functions')}
		<FunctionsAside />
	{/if}
</div>

<SvelteToast />

<style lang="scss">
	:root {
		font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', -apple-system,
			BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background-color: var(--background, hsl(195, 61%, 14%));
		color: var(--text, white);
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
