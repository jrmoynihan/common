<script context='module' lang='ts'>
	export interface ButtonProps extends Omit<HTMLButtonAttributes, 'class'> {
		/** Options to style the tooltip or modify its visible/disabled state */
		tooltip_options?: TooltipProps,
		/** Style the button, allowing dynamic updates */
		dynamic_styles?: DynamicStyleParameters,
		/** External classes to add to the button. */
		classes?: string;
		/** The position of the icon relative to the children/content of the button */
		icon_position?: 'before' | 'after';
		/** Props on the font-awesome component for the icon */
		icon_props?: ComponentProps<Fa>;
		/** A Svelte transition to use on the button */
		transition?: SvelteTransition;
		/** Transition properties to use on the button */
		transition_config?: SvelteTransitionParams;
		/** A binding to the button element */
		button?: HTMLButtonElement;
	};
</script>

<script lang="ts">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import { tooltip, type TooltipProps } from '$actions/tooltip/tooltip.svelte.js';
	import type {
		SvelteTransition,
		SvelteTransitionParams
	} from '$lib/lib_types.js';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import type { ComponentProps } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	// TODO: box-shadow elevation options

	let {
		tooltip_options = {
			disabled: true
		},
		children,
		dynamic_styles,
		classes = '',
		icon_position = 'after',
		icon_props,
		transition = fade,
		transition_config = {},
		button = $bindable(),
		...attributes
	} : ButtonProps = $props();
</script>

{#snippet fa_icon(icon_props: ComponentProps<Fa>)}
	<Fa {...icon_props}/>
{/snippet}

<button
	bind:this={button}
	transition:transition={transition_config}
	use:dynamic_style={dynamic_styles}
	use:tooltip={{ ...tooltip_options }}
	class={`_button ${classes}`}
	type="button"
	{...attributes}
	>
	{#if icon_props && icon_position === 'before'}
		{@render fa_icon(icon_props)}
	{/if}
	
	{@render children?.()}

	{#if icon_props && icon_position === 'after'}
		{@render fa_icon(icon_props)}
	{/if}
</button>

<style lang="scss">
	@layer button {
		._button {
			cursor: pointer;
		}
	}
</style>
