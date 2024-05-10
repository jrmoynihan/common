<script lang="ts" context="module">
	import type { DynamicStyleParameters } from '$actions/dynamic-styles.svelte';

	export interface InputProps extends HTMLInputAttributes {
		/** A binding to the `<input>` element. */
		input_element?: HTMLInputElement;
		/** A binding to the value of the input. */
		value?: unknown;
		/** A binding to Whether the input is valid. Defaults to `true`. */
		valid?: boolean;
		/** Styles to apply to the input element including hover, focus, and active styles. */
		dynamic_input_styles?: DynamicStyleParameters;
		/** The key used to confirm the input. Defaults to `Enter`.  Set to `null` to disable `onkeypress` confirmations. */
		confirm_key?: string;
		/** A callback that runs when the `confirm_key` is pressed.  If an `onkeypress` event handler is provided, this will be ignored. */
		onconfirm?: FormEventHandler<HTMLInputElement>;
	}
</script>

<script lang="ts">
	import { dynamicStyle } from '$lib';
	import type { FormEventHandler, HTMLInputAttributes } from 'svelte/elements';

	let {
		input_element = $bindable(),
		value = $bindable(),
		valid = $bindable(true),
		dynamic_input_styles = $bindable(),
		confirm_key = 'Enter',
		onconfirm,
		...input_attributes
	}: InputProps = $props();

	function confirm(e: any) {
		onconfirm?.(e);
		input_element?.blur();
	}

	function handle_keypress(e: KeyboardEvent) {
		if (confirm_key && e.key === confirm_key) confirm(e);
	}

	$effect(() => {
		if (input_element && value) {
			valid = input_element.checkValidity();
		}
	});
</script>

<input
	use:dynamicStyle={dynamic_input_styles}
	bind:this={input_element}
	bind:value
	class:value
	onkeypress={handle_keypress}
	id={crypto?.randomUUID()}
	{...input_attributes}
/>

<style>
	input {
		box-sizing: border-box;
		position: relative;
		grid-area: input; /* Will overlap with the placeholder; */
		appearance: textfield;
		-moz-appearance: textfield;
		background-color: var(--background-color, revert);
		color: var(--input-color, fieldtext);
		width: 100%;
		margin: 0;
		border-radius: var(--input-border-radius, 1em);
		border-radius: var(--input-border-radius, 1rem);
		border: var(--input-border, inset);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: var(--input-padding, 1.25em);
		padding-bottom: 0.5em;
		/* to make room for the cancel button */
		padding-right: var(--input-button-padding-space, 2.5em);

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
			appearance: none;
		}

		/* max-height: max-content;  // causes issues on Safari */

		/** Moved some of the placeholder styling from the input to the TextLabel component */
		&:invalid {
			outline: var(--input-invalid-outline, intitial);
		}
		&:valid:focus-visible {
			outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
		}

		/* When the input isn't focused, but has a value, continue to fade the placeholder div */
		&.value:not(:focus) ~ :global(.placeholder) {
			opacity: 0.4;
		}
	}
</style>
