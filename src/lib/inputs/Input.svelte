<script lang="ts" module>
	import type { DynamicStyleParameters } from '$actions/dynamic-styles.svelte';

	export interface InputProps extends HTMLInputAttributes {
		/** A binding to the `<input>` element. */
		input_element?: HTMLInputElement;
		/** A binding to the value of the input. */
		value?: unknown;
		/** A binding to the group of the input (for radio buttons and checkboxes). */
		group?: unknown;
		/** A binding to Whether the input is valid. Defaults to `true`. */
		valid?: boolean;
		/** Styles to apply to the input element including hover, focus, and active styles. */
		dynamic_input_styles?: DynamicStyleParameters;
		/** The key used to confirm the input. Defaults to `Enter`.  Set to `null` to disable `onkeypress` confirmations. */
		confirm_key?: string;
		/** A callback that runs when the `confirm_key` is pressed.  If an `onkeypress` event handler is provided, this will be ignored. */
		onconfirm?: FormEventHandler<HTMLInputElement>;
		/** A callback that runs when the input is valid. */
		onvalid?: FormEventHandler<HTMLInputElement>;
	}
</script>

<script lang="ts">
	import { dynamic_style } from '$lib';
	import { onMount } from 'svelte';
	import type { FormEventHandler, HTMLInputAttributes } from 'svelte/elements';

	let {
		input_element = $bindable(),
		value = $bindable(),
		group = $bindable(),
		valid = $bindable(true),
		hidden = $bindable(false),
		dynamic_input_styles = $bindable(),
		checked = $bindable(),
		confirm_key = 'Enter',
		onconfirm,
		onvalid,
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
			if (valid) {
				input_element.dispatchEvent(new Event('valid', { bubbles: true }));
			}
		} else {
			valid = true;
		}
	});
	onMount(() => {
		if (onvalid && input_element) {
			input_element.addEventListener('valid', (ev) => {
				onvalid({ ...ev, currentTarget: ev.currentTarget as EventTarget & HTMLInputElement });
			});
		}
	});
</script>

{#if group}
	<input
		use:dynamic_style={dynamic_input_styles}
		bind:this={input_element}
		bind:group
		{value}
		class:value
		class:hidden
		onkeypress={handle_keypress}
		id={crypto?.randomUUID()}
		{...input_attributes}
	/>
{:else}
	<input
		use:dynamic_style={dynamic_input_styles}
		bind:this={input_element}
		bind:value
		class:value
		class:hidden
		onkeypress={handle_keypress}
		id={crypto?.randomUUID()}
		{...input_attributes}
	/>
{/if}

<style>
	@layer input {
		input {
			box-sizing: border-box;
			position: relative;
			grid-area: input; /* Will overlap with the placeholder; */
			appearance: textfield;
			-moz-appearance: textfield;
			background-color: var(--background-color, revert);
			color: var(--input-color, fieldtext);
			margin: 0;
			border-radius: var(--input-border-radius, 1em);
			border: var(--input-border, inset light-dark(rgb(118, 118, 118), rgb(133, 133, 133)));
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
			&:user-invalid {
				outline: var(--input-invalid-outline, intitial);
			}
			&:user-valid:focus-visible {
				outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
			}

			/* When the input isn't focused, but has a value, continue to fade the placeholder div */
			&.value:not(:focus) ~ :global(.placeholder) {
				opacity: 0.4;
			}
			&.hidden {
				visibility: hidden;
				height: 0;
				width: 0;
				display: 0;
			}
		}
	}
</style>
