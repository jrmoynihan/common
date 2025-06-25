<script lang="ts" module>
	export interface InputProps extends HTMLInputAttributes {
		/** A binding to the `<input>` element. */
		input_element?: HTMLInputElement;
		/** A binding to the value of the input. */
		value?: unknown;
		/** A binding to the group of the input (for radio buttons and checkboxes). */
		group?: unknown;
		/** A binding to Whether the input is valid. Defaults to `true`. */
		valid?: boolean;
		/** The key used to confirm the input. Defaults to `Enter`.  Set to `null` to disable `onkeypress` confirmations. */
		confirm_key?: string;
		/** A callback that runs when the `confirm_key` is pressed.  If an `onkeypress` event handler is provided, this will be ignored. */
		onconfirm?: FormEventHandler<HTMLInputElement>;
		/** A callback that runs when the input is valid. */
		onvalid?: FormEventHandler<HTMLInputElement>;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { FormEventHandler, HTMLInputAttributes } from 'svelte/elements';

	let {
		id = $bindable(crypto.randomUUID()),
		input_element = $bindable(),
		value = $bindable(),
		group = $bindable(),
		valid = $bindable(),
		hidden = $bindable(false),
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
		bind:this={input_element}
		bind:group
		{id}
		{value}
		class:value
		class:hidden
		onkeypress={handle_keypress}
		{...input_attributes}
	/>
{:else}
	<input
		bind:this={input_element}
		bind:value
		class:value={input_attributes.type === 'number' ? value !== undefined && value !== null : value}
		class:hidden
		onkeypress={handle_keypress}
		{id}
		{...input_attributes}
	/>
{/if}

<style>
	@layer common.input {
		input {
			box-sizing: border-box;
			position: relative;
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

			&[type='*']:focus,
			&:focus-visible {
				box-shadow: var(--input-focus-box-shadow, none);
			}

			/** Moved some of the placeholder styling from the input to the TextLabel component */
			&:user-invalid {
				outline: var(--input-invalid-outline, intitial);
				background-color: var(--input-invalid-background-color, initial);
			}
			&:user-valid {
				background-color: var(--input-valid-background-color, initial);
			}
			&:focus-visible {
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
