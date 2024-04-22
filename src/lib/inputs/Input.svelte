<script lang="ts" context="module">
	import type { DynamicStyleParameters } from '$actions/dynamic-styles';

	export interface InputProps {
		input_element?: HTMLInputElement;
		value?: unknown;
		valid?: boolean;
		allow_enter_to_confirm?: boolean;
		dynamic_input_styles?: DynamicStyleParameters;
		id?: string;
		input_attributes?: HTMLInputAttributes;
		invalid_msg_visible?: boolean;
		oninput?: FormEventHandler<HTMLInputElement> | undefined | null;
		/** A callback that runs when the confirm button is clicked */
		onconfirm?: EventHandler;
	}
</script>

<script lang="ts">
	import { dynamicStyle } from '$lib';
	import type { EventHandler, FormEventHandler, HTMLInputAttributes } from 'svelte/elements';

	let {
		input_element = $bindable(),
		value = $bindable(),
		valid = $bindable(true),
		allow_enter_to_confirm = true,
		dynamic_input_styles = $bindable(),
		input_attributes,
		oninput,
		onconfirm = () => input_element?.blur()
	}: InputProps = $props();

	function confirm(e: any) {
		onconfirm?.(e);
	}

	function handle_keypress(e: KeyboardEvent) {
		if (e.key === 'Enter' && allow_enter_to_confirm) confirm(e);
	}
	function handle_input(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		oninput?.(e);
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
	oninput={handle_input}
	id="{crypto?.randomUUID()},"
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
