<script module lang="ts">
	export interface TextInputProps extends InputProps {
		input_element?: HTMLInputElement;
		value?: unknown;
		show_confirm?: boolean;
		show_cancel?: boolean;
		allow_enter_to_confirm?: boolean;
		button_props?: InputButtonProps;
		label_element?: HTMLLabelElement;
		/** Props on the `<label>` element that wraps the input, including the tooltip action and transition directive. */
		label_props?: InputLabelProps;
		/** A binding to the placeholder <div> element */
		placeholder_element?: HTMLDivElement;
		placeholder_props?: PlaceholderProps;
		/** A binding to the valid state of the input. */
		valid?: boolean;
		/** The id of the input and the for attribute of the label.  Defaults to a random UUID. */
		for_id?: string;
	}
</script>

<script lang="ts">
	import Input, { type InputProps } from './Input.svelte';
	import InputButton, { type InputButtonProps } from './InputButton.svelte';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';
	import Placeholder, { type PlaceholderProps } from './Placeholder.svelte';

	let {
		input_element = $bindable(),
		value = $bindable(),
		placeholder_element = $bindable(),
		label_element = $bindable(),
		valid = $bindable(),
		for_id = $bindable(crypto.randomUUID()),
		show_confirm = true,
		show_cancel = true,
		allow_enter_to_confirm = true,
		button_props,
		placeholder_props = {},
		label_props = { ...placeholder_props },
		children,
		onconfirm = confirm,
		oncancel = clear_input,
		onkeypress = handle_keypress,
		...input_attributes
	}: TextInputProps = $props();

	function clear_input() {
		value = '';
		input_element?.focus();
	}

	function confirm(e: any) {
		if (!valid) {
			return;
		}
		input_element?.blur();
	}

	function handle_confirm_click(e: MouseEvent) {
		onconfirm(e as any);
	}

	function handle_keypress(e: KeyboardEvent) {
		if (e.key === 'Enter' && allow_enter_to_confirm) confirm(e);
	}

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

<InputLabel bind:label_element bind:valid bind:for_id {...label_props}>
	<Input
		bind:input_element
		bind:value
		bind:valid
		bind:id={for_id}
		{oncancel}
		{onconfirm}
		{onkeypress}
		type={'text'}
		{...input_attributes}
	/>
	{#key placeholder_props}
		<Placeholder bind:placeholder_element {...placeholder_props} />
	{/key}
	{#if children}
		{@render children()}
	{/if}
	<div class={['_btn-container', { valid, show_confirm, value }]}>
		{#if show_confirm}
			<InputButton
				tabindex={value && valid ? 0 : -1}
				onclick={handle_confirm_click}
				disabled={!value}
				icon_props={{
					icon: 'fa6-solid:check',
					color: 'var(--text-input-button-color, buttontext)'
				}}
				{...button_props}
				style={`${value === undefined || value === null ? null : 'display: none;'}`}
				class={['_confirm-btn', { value, valid }]}
			></InputButton>
		{/if}
		{#if show_cancel}
			<InputButton
				tabindex={value ? 0 : -1}
				onclick={clear_input}
				disabled={!value}
				icon_props={{ icon: 'fa6-solid:x', color: 'var(--text-input-button-color, buttontext)' }}
				{...button_props}
				class={['_cancel-btn', { valid, value }, !show_confirm && 'no-confirm']}
			></InputButton>
		{/if}
	</div>
</InputLabel>

<style>
	/** Avoid miscalculating size of padding/widths by including it in the box mesaurement */
	* {
		box-sizing: border-box;
	}
	._btn-container {
		--input-button-margin: 0.15rem;
		box-sizing: content-box;
		display: grid;
		margin: 0;
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
			calc(var(--input-border-radius, 1em) - var(--input-padding, 1.25em)),
			var(--input-border-radius, 1em)
		);
		border-bottom-right-radius: max(
			calc(var(--input-border-radius, 1em) - var(--input-padding, 1.25em)),
			var(--input-border-radius, 1em)
		);
		overflow: hidden;
		isolation: isolate; /* Contain the z-index stacking context for the buttons to this container. */
		&:not(.valid) {
			grid-template-rows: minmax(0, 0fr) minmax(0, 1fr);
		}
		&:not(.show_confirm) {
			grid-template-rows: minmax(0, 0fr) minmax(0, 1fr);
		}
		&:not(.value) {
			grid-template-rows: minmax(0, 0fr);
			grid-template-columns: minmax(0, 0fr);
		}
	}
	@layer common.input.button {
		:global(:is(._cancel-btn.value, ._confirm-btn.value)) {
			opacity: 0.5;
		}
		:global(:is(._cancel-btn.value, ._confirm-btn.value):where(:hover, :focus-visible)) {
			opacity: 1;
		}
		:global(:is(._cancel-btn, ._confirm-btn):where(:focus-visible)) {
			outline: 1px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) solid;
		}
		:global(._cancel-btn) {
			grid-area: cancel;
			transform-origin: top right;
			scale: 1 1;
			border-bottom-right-radius: max(
				calc(var(--input-border-radius, 1em) - var(--input-padding, 1.25em)),
				var(--input-border-radius, 1em)
			);
		}
		:global(._cancel-btn:not(.value)) {
			scale: 0 1;
		}
		:global(._cancel-btn:is(.no-confirm), :not(.valid)._cancel-btn) {
			box-sizing: border-box;
			margin-bottom: 0;
			/* padding: calc(var(--max-width) / 3.5) calc(var(--max-width) / 3); */
			max-height: 100%;
			height: 100%;
			justify-self: end;
			margin-right: 0;
			aspect-ratio: unset;
			border-top-right-radius: max(
				calc(var(--input-border-radius, 1em) - var(--input-padding, 1.25em)),
				var(--input-border-radius, 1em)
			);
		}

		:global(._confirm-btn) {
			grid-area: confirm;
			transform-origin: top right;
			border-top-right-radius: max(
				calc(var(--input-border-radius, 1em) - var(--input-padding, 1.25em)),
				var(--input-border-radius, 1em)
			);
		}
		:global(._confirm-btn:not(.valid)) {
			display: none;
			pointer-events: none;
			opacity: 0;
			scale: 1 0;
			padding: 0;
			height: 0;
		}
	}
</style>
