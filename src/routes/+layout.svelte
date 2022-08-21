<script lang="ts">
	import { dev } from '$app/env';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Transition from '$lib/wrappers/Transition.svelte';
	import { writable } from 'svelte/store';

	let coords = writable({ x: 0, y: 0 });
	let links = ['tooltips', 'inputs', 'buttons', 'wrappers'];
	let refresh: boolean = false;

	// Determine if the current path matches a given path string
	function doesPathMatchCurrentURL(path: string, currentURL: string) {
		return currentURL.includes(`/${path}`);
	}
	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
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
	});
</script>

<svelte:window on:mousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })} />
{#if dev}
	<div class="top-left" style="color:orange">
		<p>X: {$coords.x}</p>
		<p>Y: {$coords.y}</p>
	</div>
{/if}
<h1>
	<a href="/" sveltekit:prefetch class="cool-text">The Commons</a>
</h1>
<section>
	{#each links as link}
		{@const is_current_page = doesPathMatchCurrentURL(link, $page.url.pathname)}
		<a href="/{link}" sveltekit:prefetch class="link" class:current-page={is_current_page}
			>{capitalize(link)}</a
		>
	{/each}
</section>
<main>
	<Transition bind:refresh>
		<slot />
	</Transition>
</main>

<style lang="scss">
	:root {
		font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', -apple-system,
			BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background-color: hsl(195, 61%, 14%);
		color: white;
		--tooltip-color: black;
		--tooltip-font-weight: 400;
		--tooltip-font-size: 12px;
	}
	.top-left {
		position: fixed;
		top: 0;
		left: 0;
		padding: 1rem 2rem;
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
		color: orange;
		text-decoration: underline;
		transition: background-color 0.2s ease-in-out;
		padding: 0.5rem;
		border-radius: 1rem;
		&:hover,
		&:focus-visible {
			background-color: hsl(195, 61%, 34%);
		}
	}
	section {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 2rem auto;
		max-width: max-content;
		gap: 1rem;
	}
	.link {
		text-decoration: none;
		font-size: 1.5rem;
		padding: 1rem;
		color: white;
		border-radius: 2rem;
		background-color: hsl(195, 61%, 34%);
		transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		&:hover,
		&:focus-visible {
			background-color: hsl(195, 61%, 44%);
		}
		&.current-page {
			box-shadow: 0 0 14px 4px orange;
			background-color: hsl(195, 61%, 44%);
		}
	}
</style>
