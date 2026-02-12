<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface InputButtonProps extends HTMLButtonAttributes {}
</script>

<script lang="ts">
	let { children, ...button_attributes }: InputButtonProps = $props();
</script>

<button type="button" {...button_attributes} class={[`_input_button`, button_attributes.class]}>
	{@render children?.()}
</button>

<style>
	@layer common.button {
		:global(._input_button) {
			display: grid;
			place-items: center;
			z-index: var(--spinner-z-index, var(--above, 1));
			max-height: var(--max-height, auto);
			background-color: field;
			appearance: textfield;
			text-align: center;
			color: var(--text-input-color, fieldtext);
			border: var(--text-input-button-border, 1px inset buttonborder);
			padding: var(--text-input-button-padding, 0.5em);
			transition: all 300ms ease;
			outline: 1px currentColor inset;
			outline-offset: -1px;
			border: 0px;
		}
		:global(._input_button:active) {
			background-color: oklch(from var(--text, currentColor) l c h / 0.5);
			outline: 2px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) inset;
		}
		:global(._input_button:focus) {
			outline: 2px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) outset;
		}
	}
</style>
