<script module lang="ts">
	export interface ButtonProps extends HTMLButtonAttributes {
		/** A Svelte transition to use on the button */
		transition?: SvelteTransition;
		/** Transition properties to use on the button */
		transition_config?: SvelteTransitionParams;
		/** A binding to the button element */
		button?: HTMLButtonElement;
		/** Is the button disabled? */
		disabled?: boolean | null | undefined;
	}
</script>

<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		children,
		transition = fade,
		transition_config = {},
		button = $bindable(),
		disabled = $bindable(),
		...attributes
	}: ButtonProps = $props();
</script>

<button
	bind:this={button}
	transition:transition={transition_config}
	type="button"
	{disabled}
	{...attributes}
	class={[`_button`, attributes?.class]}
>
	{@render children?.()}
</button>

<style>
	@layer common.button {
		._button {
			cursor: pointer;
			&:disabled {
				cursor: not-allowed;
			}
		}
	}
</style>
