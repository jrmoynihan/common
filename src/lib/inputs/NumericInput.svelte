<script lang="ts">
	import { dynamicStyle, type DynamicStyleParameters } from '$actions/dynamic-styles.js';
	import { tooltip, type TooltipProps } from '$actions/tooltip/tooltip.svelte.js';
	import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import { type ComponentProps, type Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import Placeholder from './Placeholder.svelte';

	interface NumericInputProps {
		numeric_input?: HTMLInputElement | null;
		value?: string | number | string[] | null;
		label_element?: HTMLLabelElement;
		invalid_msg?: string;
		show_spinner_buttons?: boolean;
		tooltip_options?: TooltipProps | null;
		container_styles?: DynamicStyleParameters;
		input_styles?: DynamicStyleParameters;
		placeholder_props?: ComponentProps<Placeholder>;
		input_attributes?: HTMLInputAttributes;
		/** Props on the `<label>` element that wraps the input, including the tooltip action and transition directive. */
		label_props?: ComponentProps<InputLabel>;
		/** A spinner button Snippet for both up and down buttons*/
		spinner_button?: Snippet;
		/** A spinner button Snippet for the up button */
		up_spinner_button?: Snippet;
		/** A spinner button Snippet for the down button */
		down_spinner_button?: Snippet;
	}
	// TODO: add a prop for a custom validity function?
	// TODO: add a SHIFT/CTRL modifier to allow for larger steps too


	let {
		value = $bindable(0),
		numeric_input = $bindable(),
		label_element = $bindable(),
		input_attributes,
		show_spinner_buttons = true,
		tooltip_options = null,
		container_styles,
		input_styles,
		placeholder_props,
		label_props,
		spinner_button,
		up_spinner_button,
		down_spinner_button
	} : NumericInputProps = $props();

	export const is_valid = $derived(numeric_input?.checkValidity() ?? true);
	
</script>

{#snippet default_spinner_button({classes, icon, size, callback})}
<button
	class="spinner {classes}"
	onclick={callback}
>
	<Fa {icon} {size} />
</button>
{/snippet}

<InputLabel bind:label_element {...label_props} >
	<div
		use:tooltip={tooltip_options ? { ...tooltip_options } : { disabled: true, visible: false }}
		use:dynamicStyle={container_styles}
		title={input_attributes?.title ? input_attributes.title : input_attributes?.placeholder}
		class="numeric-input-container"
		class:show-spinner-buttons={show_spinner_buttons}
	>
		<Placeholder {...placeholder_props} />
		<input
			use:dynamicStyle={input_styles}
			bind:this={numeric_input}
			bind:value
			type="number"
			inputmode="numeric"
			min={0}
			max={Infinity}
			step={1}
			{...input_attributes}
		/>
		{#if show_spinner_buttons}
			{@const max_num = Number(input_attributes?.max ?? Infinity)}
			{@const min_num = Number(input_attributes?.min ?? 0)}
			{@const current = Number(value)}
			{@const step = Number(input_attributes?.step ?? 1)}
			{#if up_spinner_button}
				{@render up_spinner_button()}
			{:else if spinner_button}
				{@render spinner_button()}
			{:else}
				{@render default_spinner_button({classes: 'plus', icon: faCaretUp, size: 'xs', callback: () => {
					if(current + step <= max_num) {
						value = Number(value) + step;
					}
				}})}
			{/if}
			{#if down_spinner_button}
				{@render down_spinner_button()}
			{:else if spinner_button}
				{@render spinner_button()}
			{:else}
				{@render default_spinner_button({classes: 'minus', icon: faCaretDown, size: 'xs', callback: () => {
					if(current - step >= min_num) {
						value = Number(value) - step;
					}
				}})}
			{/if}
		{/if}
	</div>
</InputLabel>

<style lang="scss">
	.numeric-input-container {
		display: grid;
		border-radius: 1rem;
		position: relative;
		width: var(--numeric-input-container-width, 100%);
		isolation: isolate; // Contain the z-index stacking context for the buttons to this container.
		&.show-spinner-buttons {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.75rem);
			grid-template-rows: repeat(2, minmax(0, 1fr));
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
		appearance: textfield;
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
