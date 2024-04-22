<script lang="ts">
	import { dynamicStyle, type DynamicStyleParameters } from '$actions/dynamic-styles.js';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons/index';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import { type ComponentProps, type Snippet } from 'svelte';
	import type {
		EventHandler,
		FormEventHandler,
		HTMLInputAttributes,
		MouseEventHandler
	} from 'svelte/elements';
	import Input from './Input.svelte';
	import InputLabel from './InputLabel.svelte';
	import Placeholder from './Placeholder.svelte';

	type TextInputProps = {
		input_element?: HTMLInputElement;
		value?: unknown;
		show_confirm?: boolean;
		show_cancel?: boolean;
		allow_enter_to_confirm?: boolean;
		dynamic_button_styles?: DynamicStyleParameters;
		dynamic_input_styles?: DynamicStyleParameters;
		input_attributes?: HTMLInputAttributes;
		label_element?: HTMLLabelElement;
		/** Props on the `<label>` element that wraps the input, including the tooltip action and transition directive. */
		label_props?: ComponentProps<InputLabel>;
		placeholder_props?: ComponentProps<Placeholder>;
		children?: Snippet;
		/** A callback that runs when the confirm button is clicked */
		onconfirm?: EventHandler;
		/** A callback that runs when the cancel button is clicked */
		oncancel?: (
			e: FormEventHandler<HTMLInputElement>
		) => unknown | MouseEventHandler<HTMLButtonElement>;
		/** A callback that runs when the input is changed */
		oninput?: FormEventHandler<HTMLInputElement> | undefined | null;
	};
	let {
		input_element = $bindable(),
		value = $bindable(),
		show_confirm = true,
		show_cancel = true,
		allow_enter_to_confirm = true,
		dynamic_button_styles,
		dynamic_input_styles,
		input_attributes,
		placeholder_props = {},
		label_element = $bindable(),
		label_props = { placeholder_props },
		children,
		onconfirm = () => input_element?.blur(),
		oncancel = clear_input,
		oninput
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
	}
	function handle_input(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		oninput?.(e);
	}

	function handle_click(e: MouseEvent) {
		confirm(e);
	}

	let valid = $state(true);
	

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

<InputLabel {...label_props} bind:label_element bind:valid >
	<Input 
		bind:dynamic_input_styles
		bind:input_element
		bind:value
		bind:valid
		input_attributes={{
			onkeypress: handle_keypress,
			oninput: handle_input,
			type: 'text',
			...input_attributes
		}}
	/>
		{#key placeholder_props}
			<Placeholder {...placeholder_props} />
		{/key}
		{#if children}
			{@render children()}
		{/if}
	<div class="btn-container" class:valid class:show_confirm class:value>
		{#if show_confirm}
			<!-- <ButtonRunes 
				icon_props={{
					icon: faCheck,
					color: 'var(--text-input-button-color, buttontext)'
				}} 
				attributes={{ onclick: confirm, disabled: !value}}
				dynamic_styles={dynamic_button_styles}
				classes={`confirm-btn ${is_valid ? 'valid': ''} ${value ? 'value' : ''}`}
			/> -->
			<button
				use:dynamicStyle={dynamic_button_styles}
				class="confirm-btn"
				class:valid
				tabindex={value && valid ? 0 : -1}
				class:value
				onclick={handle_click}
				disabled={!value}
			>
				<Fa icon={faCheck} color="var(--text-input-button-color, buttontext)" />
			</button>
		{/if}
		{#if show_cancel}
			<button
				use:dynamicStyle={dynamic_button_styles}
				class="cancel-btn"
				class:no-confirm={!show_confirm || !valid}
				tabindex={value ? 0 : -1}
				class:value
				onclick={cancel}
				disabled={!value}
			>
				<Fa icon={faX} color="var(--text-input-button-color, buttontext)" />
			</button>
		{/if}
	</div>
	<!-- {#if invalid_msg_visible && invalid_msg}
		<span transition:slide class="invalid-msg">{invalid_msg}</span>
	{/if} -->
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
			grid-template-rows: none;
			grid-template-columns: none;
		}
	}
	@layer button {
		.cancel-btn, .confirm-btn {
			--max-width: 1.75rem;
			box-sizing: content-box;
			display: grid;
			place-items: center;
			max-height: var(--max-width);
			aspect-ratio: 1 / 1;
			background-color: field;
			appearance: textfield;
			color: var(--text-input-color, fieldtext);
			border: var(--text-input-button-border, 1px inset buttonborder);
			padding: var(--text-input-button-padding, calc(var(--max-width) / 3.5));
			opacity: 0;
			transition: all 300ms ease;
			outline: 1px currentColor inset;
			outline-offset: -1px;
			border: 0px;
	
			&:focus {
				outline: 1px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) solid;
			}
	
			&.value {
				opacity: 0.5;
	
				&:hover,
				&:focus-visible {
					opacity: 1;
				}
				&:focus-visible {
					outline: 1px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) solid;
				}
			}
		}
		.cancel-btn {
			grid-area: cancel;
			transform-origin: top right;
			scale: 1 1;
			&:not(.value) {
				scale: 0 1;
			}
			&.no-confirm {
				box-sizing: border-box;
				margin-bottom: 0;
				/* padding: calc(var(--max-width) / 3.5) calc(var(--max-width) / 3); */
				max-height: 100%;
				height: 100%;
				justify-self: end;
				margin-right: 0;
				aspect-ratio: unset;
			}
		}
		.confirm-btn {
			grid-area: confirm;
			transform-origin: top right;
			&:not(.valid) {
				pointer-events: none;
				opacity: 0;
				scale: 1 0;
				padding: 0;
				height: 0;
			}
		}

	}
</style>
