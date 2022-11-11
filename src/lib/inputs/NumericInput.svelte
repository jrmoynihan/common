<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import { tooltip, type TooltipParameters } from '$tooltip/tooltip-action.js';
	import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import {
		fly,
		type BlurParams,
		type FadeParams,
		type FlyParams,
		type ScaleParams,
		type SlideParams
	} from 'svelte/transition';

	export let numeric_input: HTMLInputElement | null = null;
	export let value: string | number | string[] = 0;
	export let min: string | number = 0;
	export let max: string | number = Infinity;
	export let step: number = 1;
	export let placeholder: string = '';
	export let name: string = '';
	export let id: string = '';
	export let invalid_msg: string = '';
	export let required = false;
	export let is_valid: boolean = true;
	export let show_spinner_buttons = true;
	export let tooltip_options: TooltipParameters = {};
	export let container_styles: string = '';
	export let container_hover_styles: string = '';
	export let container_focus_styles: string = '';
	export let container_dynamic_styles: string = '';
	export let input_styles: string = '';
	export let input_hover_styles: string = '';
	export let input_focus_styles: string = '';
	/** Dynamically reactive styles to apply.  Invalid input styles automatically get appended to this. */
	export let input_dynamic_stles: string = '';
	/** Styles for when the input fails its validity test */
	export let invalid_input_styles: string = 'color: salmon;';
	export let pattern: string | null | undefined = null;
	// TODO: add a prop for a custom validity function?

	export let svelteTransition = fly;
	export let transitionParams: FlyParams | FadeParams | SlideParams | ScaleParams | BlurParams = {
		duration: 0
	};
	const dispatch = createEventDispatcher();
	async function changed(value: string) {
		dispatch('change', value);
	}
	$: {
		value;
		is_valid = numeric_input?.checkValidity() ?? true;
	}
</script>

<div
	use:tooltip={{
		visible: !is_valid,
		disabled: is_valid || !invalid_msg,
		...tooltip_options
	}}
	use:dynamicStyle={{
		styles: container_styles,
		hover_styles: container_hover_styles,
		focus_styles: container_focus_styles,
		dynamic_styles: container_dynamic_styles
	}}
	class="numeric-input-container"
	class:show-spinner-buttons={show_spinner_buttons}
	transition:svelteTransition={transitionParams}
>
	<input
		use:dynamicStyle={{
			styles: input_styles,
			hover_styles: input_hover_styles,
			focus_styles: input_focus_styles,
			dynamic_styles: `${input_dynamic_stles}; ${is_valid ? '' : invalid_input_styles}`
		}}
		bind:this={numeric_input}
		type="number"
		{id}
		{name}
		{placeholder}
		{step}
		{min}
		{max}
		{pattern}
		{required}
		bind:value
		on:change={async (e) => changed(e.currentTarget.value)}
	/>
	{#if show_spinner_buttons}
		<button
			class="plus spinner"
			on:click={() => {
				if (Number(value) + Number(step) <= max) {
					value = Number(value) + Number(step);
				}
			}}
		>
			<Fa icon={faCaretUp} size={'xs'} />
		</button>
		<button
			class="minus spinner"
			on:click={() => {
				if (Number(value) - Number(step) >= min) {
					value = Number(value) - Number(step);
				}
			}}
		>
			<Fa icon={faCaretDown} size={'xs'} />
		</button>
	{/if}
</div>

<style lang="scss">
	.numeric-input-container {
		display: grid;
		border-radius: 1rem;
		position: relative;
		width: var(--numeric-input-container-width, 100%);
		isolation: isolate; // Contain the z-index stacking context for the buttons to this container.
		&.show-spinner-buttons {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.75rem);
			grid-template-areas:
				'input plus '
				'input minus ';
		}
	}
	input {
		position: relative;
		grid-row: 1 / span 2;
		grid-column: 1 / span 2;
		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
			appearance: none;
		}
		-moz-appearance: textfield;
		text-align: center;
		padding: 1rem;
		padding-right: 1.75rem;
		border-radius: var(--input-border-radius, 1rem);
	}
	.spinner {
		z-index: var(--spinner-z-index, var(--above, 1));
		width: 1.75rem;
		height: 100%;
		background: var(--spinner-background);
		color: var(--spinner-color);
	}
	.plus {
		grid-area: plus;
		border-top-right-radius: inherit;
	}
	.minus {
		grid-area: minus;
		border-bottom-right-radius: inherit;
	}
</style>
