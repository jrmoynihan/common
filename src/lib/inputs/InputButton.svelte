<script context="module" lang="ts">
	import type { ButtonProps } from '$buttons/Button_Runes.svelte';

    export interface InputButtonProps extends ButtonProps {
        
    }
</script>

<script lang="ts">
	import { Button } from '$lib';

    let {
        children,
        ...button_attributes
    } : InputButtonProps = $props()
</script>

<Button {...button_attributes}>
    {#if children}
        {@render children()}
    {/if}
</Button>

<style>
	@layer button {
		:global(button.button) {
			--max-width: 1.75rem;
			display: grid;
			place-items: center;
			z-index: var(--spinner-z-index, var(--above, 1));
			max-height: var(--max-height, auto);
			height: var(--height, 100%);
			background-color: field;
			appearance: textfield;
            text-align: center;
			color: var(--text-input-color, fieldtext);
			border: var(--text-input-button-border, 1px inset buttonborder);
			padding: var(--text-input-button-padding, calc(var(--max-width) / 3.5));
			transition: all 300ms ease;
			outline: 1px currentColor inset;
			outline-offset: -1px;
			border: 0px;
		}
		:global(button.button:active) {
			background-color: oklch(from var(--text, currentColor) l c h / 0.5);
			outline: 2px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) inset;
		}
		:global(button.button:focus) {
			outline: 2px var(--button-outline-hover-or-focus, -webkit-focus-ring-color) outset;
		}
	}
</style>
