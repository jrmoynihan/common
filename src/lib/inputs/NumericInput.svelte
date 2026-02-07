<script module lang="ts">
	export interface NumericInputProps extends Omit<InputProps, 'placeholder'> {
		/** The value of the input. */
		value?: string | number | string[] | null;
		/** Whether the input is valid. */
		valid?: boolean;
		/** The id of the input and the `for` attribute of the label. Defaults to a random UUID. */
		for_id?: string;
		/** A binding to the label element that wraps the input. */
		label_element?: HTMLLabelElement;
		/** A binding to the input element that is bound to the value. */
		input_element?: HTMLInputElement;
		/** Whether to show the spinner buttons. */
		show_spinner_buttons?: boolean;
		/** Props on the `<Placeholder>` element that wraps the input. */
		placeholder_props?: PlaceholderProps;
		/** Props on the `<label>` element that wraps the input, including the tooltip action and transition directive. */
		label_props?: InputLabelProps;
		/** A spinner button Snippet for both up and down buttons*/
		spinner_button?: Snippet;
		/** A spinner button Snippet for the up button */
		up_spinner_button?: Snippet;
		/** A spinner button Snippet for the down button */
		down_spinner_button?: Snippet;
		/** A function to call when the up button is clicked. */
		onincrement?: (e: MouseEvent | KeyboardEvent) => void;
		/** A function to call when the down button is clicked. */
		ondecrement?: (e: MouseEvent | KeyboardEvent) => void;
	}
	// TODO: add a prop for a custom validity function?
	// TODO: add a SHIFT/CTRL modifier to allow for larger steps too
</script>

<script lang="ts">
	import type { IconProps } from '@iconify/svelte';
	import { type Snippet } from 'svelte';
	import Input, { type InputProps } from './Input.svelte';
	import InputButton, { type InputButtonProps } from './InputButton.svelte';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';
	import Placeholder, { type PlaceholderProps } from './Placeholder.svelte';

	let {
		value = $bindable(),
		valid = $bindable(true),
		for_id = $bindable(crypto.randomUUID()),
		input_element = $bindable(),
		label_element = $bindable(),
		show_spinner_buttons = true,
		placeholder_props,
		label_props,
		spinner_button,
		up_spinner_button,
		down_spinner_button,
		children,
		onincrement,
		ondecrement,
		...input_attributes
	}: NumericInputProps = $props();
</script>

{#snippet default_spinner_button(icon_props: IconProps, button_props: InputButtonProps)}
	<InputButton
		{...button_props}
		disabled={input_attributes?.disabled}
		icon_props={{ style: 'color: var(--text-input-button-color, buttontext);', ...icon_props }}
	/>
{/snippet}

<InputLabel bind:label_element bind:valid bind:for_id {...label_props}>
	<Input
		bind:input_element
		bind:value
		bind:valid
		bind:id={for_id}
		inputmode="numeric"
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
						class: 'plus',
						onclick: (e) => {
							if (current + step <= max_num) {
								value = Number(value) + step;
								onincrement?.(e);
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
						class: 'minus',
						onclick: (e) => {
							if (current - step >= min_num) {
								value = Number(value) - step;
								ondecrement?.(e);
							}
						}
					}
				)}
			{/if}
		</div>
	{/if}
</InputLabel>

<style>
	@layer common.input.numeric_input {
		.btn-container {
			--text-input-button-margin: 0.15rem;
			--input-border-radius: 1rem;
			display: grid;
			margin: 0;
			place-items: center;
			place-self: center end;
			height: 100%;
			grid-area: input; /* Overlap with the placeholder and input; */
			grid-template-rows: repeat(auto-fit, minmax(0, 1fr));
			grid-template-areas:
				'plus'
				'minus';
			transition: all 300ms ease;
			scale: 1 1;
			z-index: 0;
			transform-origin: right;
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
			overflow: hidden;
			isolation: isolate; /* Contain the z-index stacking context for the buttons to this container. */
		}
	}

	@layer common.input.numeric_input {
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

	@layer common.input.button {
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
