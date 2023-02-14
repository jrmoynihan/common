<script lang="ts">
	// Inspired by https://dev.to/evanwinter/page-transitions-with-svelte-kit-35o6

	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types.js';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let refresh: unknown;
	export let inner_container_styles = '';
	export let inner_container_classes = '';
	export let transition: SvelteTransition | undefined = undefined;
	export let transition_parameters: SvelteTransitionParams | undefined = undefined;
	export let in_transition: SvelteTransition = fly;
	export let in_transition_parameters: SvelteTransitionParams = {
		duration: 200,
		delay: 300,
		easing: cubicOut
	};
	export let out_transition: SvelteTransition = fly;
	export let out_transition_parameters: SvelteTransitionParams =
		{
			...in_transition_parameters,
			//@ts-ignore
			x: -1 * in_transition_parameters?.x
		} ?? {};
	$: internal_in_transition = transition ?? in_transition;
	$: internal_out_transition = transition ?? out_transition;
	$: internal_in_transition_parameters = transition_parameters ?? in_transition_parameters;
	$: internal_out_transition_parameters = transition_parameters ?? out_transition_parameters;
</script>

<div class="transition-outer">
	{#key refresh}
		<div
			class="transition-inner {inner_container_classes}"
			style={inner_container_styles}
			in:internal_in_transition={internal_in_transition_parameters}
			out:internal_out_transition={internal_out_transition_parameters}
		>
			<slot />
		</div>
	{/key}
</div>

<style lang="scss">
	.transition-outer {
		display: grid;
		grid-template: 1fr 1fr;
		width: 100%;
	}
	.transition-inner {
		box-sizing: border-box;
		position: relative;
		max-width: 100%;
		background-size: cover;
		will-change: opacity transform;
		display: grid;
		grid-auto-rows: max-content;
		grid-row: 1;
		grid-column: 1;
	}
</style>
