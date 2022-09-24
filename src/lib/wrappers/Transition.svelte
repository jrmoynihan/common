<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types.js';
	import { tooltip, type TooltipParameters } from '$lib/tooltip/tooltip-action.js';
	import { fly } from 'svelte/transition';

	export let refresh: unknown;
	export let inner_container_styles = '';
	export let inner_container_classes = '';
	export let transition: SvelteTransition = fly;
	export let transition_parameters: SvelteTransitionParams = undefined;
	export let in_transition: SvelteTransition = transition;
	export let in_transition_parameters: SvelteTransitionParams = {
		duration: 200,
		x: -50,
		delay: 300
	};
	export let out_transition: SvelteTransition = in_transition;
	export let out_transition_parameters: SvelteTransitionParams =
		in_transition_parameters !== undefined
			? {
					...in_transition_parameters,
					//@ts-ignore
					x: -1 * in_transition_parameters?.x
			  }
			: undefined;
	export let tooltip_parameters: TooltipParameters = { disabled: true };
	$: internal_in_transition = transition ?? in_transition;
	$: internal_out_transition = transition ?? out_transition;
	$: internal_in_transition_parameters = transition_parameters ?? in_transition_parameters;
	$: internal_out_transition_parameters = transition_parameters ?? out_transition_parameters;

	// https://dev.to/evanwinter/page-transitions-with-svelte-kit-35o6
</script>

<div class="transition-outer">
	{#key refresh}
		<div
			use:tooltip={tooltip_parameters}
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
