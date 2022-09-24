<script lang="ts">
	import { tooltip, type TooltipParameters } from '$lib/tooltip';
	import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
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
	export let containerStyle: string = '';
	export let inputStyle: string = '';
	export let name: string = '';
	export let id: string = '';
	export let invalid_msg: string = '';
	export let required = false;
	export let is_valid: boolean = true;
	export let show_spinner_buttons = true;
	export let tooltip_options: TooltipParameters = {
		disabled: true
	};
	export let invalid_tooltip_css: [string, string][] = [
		['font-size', 'smaller'],
		['color', 'var(--date-input-invalid-message-color, salmon)'],
		['background', 'var(--date-input-invalid-message-background, white)'],
		['padding', '0.5rem'],
		['border-radius', '1rem']
	];
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
		css: invalid_tooltip_css,
		...tooltip_options
	}}
	class="numeric-input-container"
	class:show-spinner-buttons={show_spinner_buttons}
	style={containerStyle}
	transition:svelteTransition={transitionParams}
>
	<input
		bind:this={numeric_input}
		type="number"
		{id}
		{name}
		{placeholder}
		style={inputStyle}
		{step}
		{min}
		{max}
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
		background: var(--spinner-background, orange);
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
