<script context="module" lang="ts">
	export interface ToggleSwitchProps extends HTMLInputAttributes {
		/** The checked state of the toggle. Defaults to `false`. */
		checked?: boolean;
		/** The disabled state of the toggle. Defaults to `false`. */
		disabled?: boolean;
		/** The dynamic styles for the label. */
		label_dynamic_styles?: DynamicStyleParameters;
		/** The position of the label relative to the toggle. Defaults to `before`. */
		label_position?: 'before' | 'after';
		/** The text to display in the label. */
		label_text?: string;
		/** The text to display in the slider. */
		slider_text?: string;
		/** The attributes to apply to the `<span class="round slider">` element. */
		slider_attributes?: HTMLAttributes<HTMLSpanElement>;
		/** A callback that is triggered when the toggle is toggled.  Defaults to `() => { checked = !checked }` which allows a simple binding to the `checked` prop. */
		ontoggle?: () => void | Promise<void>;
	}
</script>

<script lang="ts">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

	let {
		checked = $bindable(),
		disabled = $bindable(),
		label_dynamic_styles,
		label_position = 'before',
		label_text,
		slider_text,
		slider_attributes,
		ontoggle,
		children,
		...input_attributes
	} : ToggleSwitchProps = $props()

	const id = crypto?.randomUUID();

</script>

<label
	use:dynamic_style={label_dynamic_styles}
	class="label-text pointer"
	for={`toggle-${id}`}
>	
	{#if label_position === 'before'}
		{#if children}
			{@render children?.()}
		{:else if label_text}
			{label_text}
		{/if}
	{/if} 
	<!-- NOTE: Subtle fix made by changing this to on:change event instead of on:click -->
	<input
		id={`toggle-${id}`}
		bind:checked
		type="checkbox"
		aria-checked={checked}
		{disabled}
		onchange={ontoggle}
		{...input_attributes}
	/>
	<span class="switch">
		<span class="slider round" data-slider-text={slider_text} {...slider_attributes}></span>
	</span>
	{#if label_position === 'after'}
		{#if children}
			{@render children?.()}
		{:else if label_text}
			{label_text}
		{/if}
	{/if}
</label>

<style>
	/* The switch - the box around the slider */
	.switch,
	.label-text {
		--toggle-scale: 1rem;
		position: relative;
		display: flex;
		align-self: center;
		align-items: center;
		width: calc(var(--toggle-scale) * 3);
	}
	.label-text{
		padding-inline: 0.25rem;
		width: auto;
		gap: 0.2rem;
		flex-wrap: wrap;
		&:has(input:focus-visible){
			outline: solid 1px var(--toggle-button-focus-color, var(--toggleBgColorActive, -webkit-focus-ring-color));
		}
		&:hover, &:focus-visible {
			color: var(--label-text-hover-color, inherit);
		}
		&:hover:has(input){
			& > .switch > .slider {
				outline: 1px solid fieldtext;
			}
			&:checked > .switch > .slider {
					background-color: var(--toggleBgColorActiveHovered, hsl(207, 90%, 34%));
				}
		}
	}
	.switch {
		background: transparent;
		box-shadow: none;
		border: none;
		border-radius: 1em;
		height: var(--toggle-height, calc(var(--toggle-scale) * 1.7));
	}
	/* The round slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--inactiveBgColor, hsl(0, 0%, 27%));
		transition: outline;
		transition-delay: 1s;
		outline-offset: 1.5px;
		&.round{
			border-radius: var(--toggle-height, calc(var(--toggle-scale) * 1.7));
			padding: 1px;
			&:before {
				border-radius: 50%;
			}
		}
	}
	.slider:before {
		position: absolute;
		content: attr(data-slider-text);
		display: grid;
		place-content: center;
		font-size: 0.9em;
		/* These new responsive sizes allow for asymmetrical toggle sliders when resizing the window*/
		height: var(--slider-height, var(--toggle-scale));
		width: var(--slider-width, var(--toggle-scale));
		left: 10%;
		top: 20%;
		background-color: var(--slider-color, white);
		-webkit-transition: all 300ms ease-in-out;
		transition: all 300ms ease-in-out;
	}
	.slider:hover {
		background-color: var(--inactiveBgColorDarken, hsl(0, 0%, 27%));
	}
	
	input{
		height: 0;
		width: 0;

		&:checked + .switch > .slider {
			background-color: var(--toggleBgColorActive, hsl(207, 90%, 54%));
			&:hover {
				background-color: var(--toggleBgColorActiveHovered, hsl(207, 90%, 34%));
			}
			&:before{
				translate: var(--slider-transform, 130%) 0 0;
			}
		}
		&:disabled + .switch > .slider {
			background-color: var(--toggleBgColorActiveHovered, hsl(207, 90%, 34%));
		}
	}
	
	.pointer {
		cursor: pointer;
	}
</style>
