<script context="module" lang="ts">
	export interface TextInputProps extends InputProps {
		input_element?: HTMLInputElement;
		value?: unknown;
		show_confirm?: boolean;
		show_cancel?: boolean;
		allow_enter_to_confirm?: boolean;
		dynamic_button_styles?: DynamicStyleParameters;
		dynamic_input_styles?: DynamicStyleParameters;
		label_element?: HTMLLabelElement;
		/** Props on the `<label>` element that wraps the input, including the tooltip action and transition directive. */
		label_props?: InputLabelProps;
		/** A binding to the placeholder <div> element */
		placeholder_element?: HTMLDivElement;
		placeholder_props?: PlaceholderProps;
		/** A callback that runs when the confirm button is clicked */
		onconfirm?: FormEventHandler<HTMLInputElement>;
		/** A callback that runs when the cancel button is clicked */
		oncancel?: FormEventHandler<HTMLInputElement>;
		/** A callback that runs when the input is changed */
		oninput?: FormEventHandler<HTMLInputElement>;
	}
</script>

<script lang="ts">
	import { type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons/index';
	import type { FormEventHandler } from 'svelte/elements';
	import Input, { type InputProps } from './Input.svelte';
	import InputButton from './InputButton.svelte';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';
	import Placeholder, { type PlaceholderProps } from './Placeholder.svelte';

	let {
		input_element = $bindable(),
		value = $bindable(),
		id = crypto?.randomUUID(),
		show_confirm = true,
		show_cancel = true,
		allow_enter_to_confirm = true,
		dynamic_button_styles,
		dynamic_input_styles,
		placeholder_element = $bindable(),
		placeholder_props = {},
		label_element = $bindable(),
		label_props = { ...placeholder_props },
		children,
		onconfirm = () => input_element?.blur(),
		oncancel = clear_input,
		oninvalid,
		onvalid,
		onblur,
		oninput,
		...input_attributes
	}: TextInputProps = $props();

	function clear_input() {
		value = '';
		input_element?.focus();
	}

	function cancel(e: any) {
		clear_input();
		oncancel?.(e);
	}

	function confirm(e: any) {
		if (!valid) {
			return;
		}
		onconfirm?.(e);
	}

	function handle_keypress(e: KeyboardEvent) {
		if (e.key === 'Enter' && allow_enter_to_confirm) confirm(e);
		placeholder_element?.dispatchEvent(new Event('keypress'));
	}
	function handle_input(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		oninput?.(e);
		placeholder_element?.dispatchEvent(new Event('input'));
	}

	function handle_click(e: MouseEvent) {
		confirm(e);
	}
	function handle_invalid(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		oninvalid?.(e);
		placeholder_element?.dispatchEvent(new Event('invalid'));
	}

	function handle_valid(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		onvalid?.(e);
		placeholder_element?.dispatchEvent(new Event('valid'));
	}
	function handle_blur(e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		onblur?.(e);
		placeholder_element?.dispatchEvent(new Event('blur'));
	}

	let valid = $state(true);

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

<InputLabel bind:label_element bind:valid {id} {...label_props}>
	<Input
		bind:dynamic_input_styles
		bind:input_element
		bind:value
		bind:valid
		{id}
		onblur={handle_blur}
		onvalid={handle_valid}
		oninvalid={handle_invalid}
		onkeypress={handle_keypress}
		oninput={handle_input}
		type={'text'}
		{...input_attributes}
	/>
	{#key placeholder_props}
		<Placeholder bind:placeholder_element {...placeholder_props} />
	{/key}
	{#if children}
		{@render children()}
	{/if}
	<div class="btn-container" class:valid class:show_confirm class:value>
		{#if show_confirm}
			<InputButton
				dynamic_styles={dynamic_button_styles}
				classes={`confirm-btn ${valid ? 'valid' : ''} ${value ? 'value' : ''}`}
				tabindex={value && valid ? 0 : -1}
				onclick={handle_click}
				disabled={!value}
				icon_props={{ icon: faCheck, color: 'var(--text-input-button-color, buttontext)' }}
			></InputButton>
		{/if}
		{#if show_cancel}
			<InputButton
				dynamic_styles={dynamic_button_styles}
				classes={`cancel-btn ${valid ? 'valid' : ''} ${value ? 'value' : ''}`}
				tabindex={value ? 0 : -1}
				onclick={cancel}
				disabled={!value}
				icon_props={{ icon: faX, color: 'var(--text-input-button-color, buttontext)' }}
			></InputButton>
		{/if}
	</div>
</InputLabel>

<style>
	/** Avoid miscalculating size of padding/widths by including it in the box mesaurement */
	* {
		box-sizing: border-box;
	}
	.btn-container {
		--text-input-button-margin: 0.15rem;
		--input-border-radius: 1rem;
		box-sizing: content-box;
		margin: 0;
		display: grid;
		place-items: center;
		grid-area: input; /* Overlap with the placeholder and input; */
		place-self: center end;
		height: 100%;
		grid-template-rows: repeat(auto-fit, minmax(0, 1fr));
		grid-template-areas:
			'confirm'
			'cancel';
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
		&:not(.valid) {
			grid-template-rows: 0fr 1fr;
		}
		&:not(.show_confirm) {
			grid-template-rows: 0 1fr;
		}
		&:not(.value) {
			grid-template-rows: 0;
			grid-template-columns: 0;
		}
	}
	@layer button {
		:global(:is(.cancel-btn.value, .confirm-btn.value)) {
			opacity: 0.5;
		}
		:global(:is(.cancel-btn.value, .confirm-btn.value):where(:hover, :focus-visible)) {
			opacity: 1;
		}
		:global(:is(.cancel-btn, .confirm-btn):where(:focus-visible)) {
			outline: 1px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) solid;
		}
		:global(.cancel-btn) {
			grid-area: cancel;
			transform-origin: top right;
			scale: 1 1;
		}
		:global(.cancel-btn:not(.value)) {
			scale: 0 1;
		}
		:global(.cancel-btn.no-confirm) {
			box-sizing: border-box;
			margin-bottom: 0;
			/* padding: calc(var(--max-width) / 3.5) calc(var(--max-width) / 3); */
			max-height: 100%;
			height: 100%;
			justify-self: end;
			margin-right: 0;
			aspect-ratio: unset;
		}

		:global(.confirm-btn) {
			grid-area: confirm;
			transform-origin: top right;
		}
		:global(.confirm-btn:not(.valid)) {
			display: none;
			pointer-events: none;
			opacity: 0;
			scale: 1 0;
			padding: 0;
			height: 0;
		}
	}
</style>
