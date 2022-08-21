<script lang="ts">
	import Transition from '$lib/wrappers/Transition.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	let links = [
		{ path: 'route-1', text: 'Transition to Route 1' },
		{ path: 'route-2', text: 'Transition to Route 2' }
	];
	console.log('data', data);
</script>

<section>
	<h2>Wrappers</h2>
	<div class="wrapper-links">
		{#each links as { path, text }}
			<a sveltekit:prefetch href={`/wrappers/${path}`}>{text}</a>
		{/each}
	</div>
	<Transition bind:refresh={data}>
		<slot />
	</Transition>
</section>

<style lang="scss">
	h2 {
		margin: auto;
	}
	.wrapper-links {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-items: center;
	}
	section {
		display: grid;
		grid-auto-rows: max-content;
		grid-template-columns: 1fr;
	}
	a {
		font-style: bold;
		color: yellow;
		padding: 0.5rem;
		&:visited {
			color: orange;
		}
	}
</style>
