<script module lang="ts">
	export interface ButtonProps extends HTMLButtonAttributes {
		/** The position of the icon relative to the children/content of the button */
		icon_position?: 'before' | 'after';
		/** Props on the `@iconify/svelte` <Icon> component */
		icon_props?: IconProps;
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
	import Icon, { type IconProps } from '@iconify/svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		children,
		icon_position = 'after',
		icon_props,
		transition = fade,
		transition_config = {},
		button = $bindable(),
		disabled = $bindable(),
		...attributes
	}: ButtonProps = $props();
</script>

{#snippet icon(icon_props: IconProps)}
	<Icon {...icon_props} />
{/snippet}

<button
	bind:this={button}
	transition:transition={transition_config}
	type="button"
	{disabled}
	{...attributes}
	class={[`_button`, attributes?.class]}
>
	{#if icon_props && icon_position === 'before'}
		{@render icon(icon_props)}
	{/if}

	{@render children?.()}

	{#if icon_props && icon_position === 'after'}
		{@render icon(icon_props)}
	{/if}
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
