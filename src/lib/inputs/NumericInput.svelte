<script module lang="ts">
	export interface NumericInputProps<K> extends InputProps {
		input_element?: HTMLInputElement;
		value?: string | number | string[] | null;
		valid?: boolean;
		dynamic_input_styles?: DynamicStyleParameters;
		label_element?: HTMLLabelElement;
		invalid_msg?: string;
		show_spinner_buttons?: boolean;
		tooltip_options?: TooltipProps<K> | null;
		container_styles?: DynamicStyleParameters;
		input_styles?: DynamicStyleParameters;
		placeholder_props?: ComponentProps<typeof Placeholder>;
		/** Props on the `<label>` element that wraps the input, including the tooltip action and transition directive. */
		label_props?: ComponentProps<typeof InputLabel>;
		/** A spinner button Snippet for both up and down buttons*/
		spinner_button?: Snippet;
		/** A spinner button Snippet for the up button */
		up_spinner_button?: Snippet;
		/** A spinner button Snippet for the down button */
		down_spinner_button?: Snippet;
	}
	// TODO: add a prop for a custom validity function?
	// TODO: add a SHIFT/CTRL modifier to allow for larger steps too
</script>

<script lang="ts" generics="T, K">
	import { type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import { type TooltipProps } from '$actions/tooltip/tooltip.svelte.js';
	import { type ComponentProps, type Snippet } from 'svelte';
	import Icon, { type IconProps } from '@iconify/svelte';
	import Input, { type InputProps } from './Input.svelte';
	import InputButton, { type InputButtonProps } from './InputButton.svelte';
	import InputLabel from './InputLabel.svelte';
	import Placeholder from './Placeholder.svelte';

	let {
		value = $bindable(0),
		valid = $bindable(true),
		input_element = $bindable(),
		label_element = $bindable(),
		dynamic_input_styles = $bindable(),
		show_spinner_buttons = true,
		tooltip_options = null,
		input_styles,
		placeholder_props,
		label_props,
		spinner_button,
		up_spinner_button,
		down_spinner_button,
		children,
		...input_attributes
	}: NumericInputProps<K> = $props();
</script>

{#snippet default_spinner_button(icon_props: IconProps, button_props: InputButtonProps<T>)}
	<InputButton {...button_props} disabled={input_attributes?.disabled}>
		<Icon
			{...icon_props}
			class="spinner-button-icon"
			style="color: var(--text-input-button-color, buttontext);"
		/>
	</InputButton>
{/snippet}

<InputLabel bind:label_element bind:valid {...label_props}>
	<Input
		bind:dynamic_input_styles
		bind:input_element
		bind:value
		bind:valid
		inputmode="numeric"
		min={0}
		max={Infinity}
		step={1}
		{...input_attributes}
		type="number"
	/>
	<Placeholder {...placeholder_props} />
	{@render children?.()}
	{#if show_spinner_buttons}
		{@const max_num = Number(input_attributes?.max ?? Infinity)}
		{@const min_num = Number(input_attributes?.min ?? 0)}
		{@const current = Number(value)}
		{@const step = Number(input_attributes?.step ?? 1)}

		<div class="btn-container">
			{#if up_spinner_button}
				{@render up_spinner_button()}
			{:else if spinner_button}
				{@render spinner_button()}
			{:else}
				{@render default_spinner_button(
					{
						icon: 'mdi:caret-up'
					},
					{
						classes: 'plus',
						onclick: () => {
							if (current + step <= max_num) {
								value = Number(value) + step;
							}
						}
					}
				)}
			{/if}

			{#if down_spinner_button}
				{@render down_spinner_button()}
			{:else if spinner_button}
				{@render spinner_button()}
			{:else}
				{@render default_spinner_button(
					{ icon: 'mdi:caret-down' },
					{
						classes: 'minus',
						onclick: () => {
							if (current - step >= min_num) {
								value = Number(value) - step;
							}
						}
					}
				)}
			{/if}
		</div>
	{/if}
</InputLabel>

<style>
	@layer numeric_input {
		.btn-container {
			--text-input-button-margin: 0.15rem;
			--input-border-radius: 1rem;
			display: grid;
			grid-template-rows: repeat(auto-fit, minmax(0, 1fr));
			grid-template-areas:
				'plus'
				'minus';
			place-items: center;
			grid-area: input; /* Overlap with the placeholder and input; */
			place-self: center end;
			height: 100%;
			transform-origin: right;
			margin: 0;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-top-right-radius: max(
				calc(var(--text-input-border-radius, 1em) - var(--text-input-padding, 1.25em)),
				var(--text-input-border-radius, 1em)
			);
			border-bottom-right-radius: max(
				calc(var(--text-input-border-radius, 1em) - var(--text-input-padding, 1.25em)),
				var(--text-input-border-radius, 1em)
			);
			transition: all 300ms ease;
			scale: 1 1;
			z-index: 0;
			overflow: hidden;
			isolation: isolate; /* Contain the z-index stacking context for the buttons to this container. */
		}
	}

	@layer input {
		:global(input[type='number']) {
			appearance: textfield;
			-moz-appearance: textfield;
			text-align: center;
			padding: 1rem;
			padding-right: 1.75rem;
			border-radius: var(--input-border-radius, 1rem);
		}
	}
	:global([data-theme='light'] button.button:focus .spinner-button-icon path) {
		fill: var(--button-outline-hover-or-focus, royalblue);
	}

	:global([data-theme='dark'] button.button:focus .spinner-button-icon path) {
		fill: var(--button-outline-hover-or-focus, lightskyblue);
	}

	@layer button {
		:global(.plus) {
			grid-area: plus;
			border-top-right-radius: inherit;
			transform-origin: top right;
		}
		:global(.minus) {
			grid-area: minus;
			border-bottom-right-radius: inherit;
			transform-origin: top right;
		}
	}
</style>
