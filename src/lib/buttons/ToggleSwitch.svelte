<script context="module" lang="ts">
	export interface ToggleSwitchProps extends ComponentProps<ButtonRunes> {
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
		/** The attributes to apply to the `<input type="checkbox">` element. */
		input_attributes?: HTMLInputAttributes;
		/** The attributes to apply to the `<span class="round slider">` element. */
		slider_attributes?: HTMLAttributes<HTMLSpanElement>;
		/** A callback that is triggered when the toggle is toggled.  Defaults to `() => { checked = !checked }` which allows a simple binding to the `checked` prop. */
		ontoggle?: () => void | Promise<void>;
	}
</script>

<script lang="ts">
	import { dynamicStyle, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import { type ComponentProps } from 'svelte';
	import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
	import ButtonRunes from './Button_Runes.svelte';

	let {
		checked = $bindable(false),
		disabled = false,
		label_dynamic_styles,
		label_position = 'before',
		label_text,
		slider_text,
		ontoggle = default_on_toggle,
		input_attributes,
		slider_attributes,
		children,
		...button_props
	} : ToggleSwitchProps = $props()

	function default_on_toggle() {
		checked = !checked;
	}

</script>

{#snippet label(label_text: string)}
	<label
		use:dynamicStyle={label_dynamic_styles}
		class="label-text pointer"
		for={'toggle'}
	>	
		{label_text}
	</label>
{/snippet}

<ButtonRunes
	--button-hover-background={'var(--toggle-button-hover-background, inherit)'}
	onpointerdown={ontoggle}
	role={'switch'}
	style={`border: 0;
			padding: 0.2rem; 
			display: grid; 
			gap: 0.5rem; 
			scale: 1em;
			background-color: var(--toggle-button-background, inherit);
			color: var(--toggle-button-color, inherit);
			${button_props?.style}`}
	classes={`toggle ${button_props?.classes}`}
	{...button_props}
>
	{#if label_position === 'before'}
		{#if children}
			{@render children()}
		{:else if label_text}
			{@render label(label_text)}
		{/if}
	{/if}
	<span class="switch">
		<!-- NOTE: Subtle fix made by changing this to on:change event instead of on:click -->
		<input
			bind:checked
			type="checkbox"
			aria-checked={checked}
			{disabled}
			onchange={ontoggle}
			{...input_attributes}
		/>
		<span class="slider round" data-slider-text={slider_text} {...slider_attributes}></span>
	</span>
	{#if label_position === 'after'}
		{#if children}
			{@render children()}
		{:else if label_text}
			{@render label(label_text)}
		{/if}
	{/if}
</ButtonRunes>

<style>
	
	/* The switch - the box around the slider */
	.switch,
	.label-text {
		--toggle-scale: 1rem;
		position: relative;
		display: flex;
		align-self: center;
		width: calc(var(--toggle-scale) * 3);
	}
	.switch {
		background: transparent;
		box-shadow: none;
		border: none;
		border-radius: 1em;
		height: var(--toggle-height, calc(var(--toggle-scale) * 1.7));
	}
	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--inactiveBgColor, hsl(0, 0%, 27%));
		-webkit-transition: all 0.4s ease-in-out;
		transition: all 0.4s ease-in-out;
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

	input {
		appearance: none;
		visibility: hidden;
		height: 0;
		width: 0;
		display: none;
	}

	input:checked + .slider {
		background-color: var(--toggleBgColorActive, hsl(207, 90%, 54%));
	}
	input:checked + .slider:before {
		translate: var(--slider-transform, 130%) 0 0;
	}
	input:checked + .slider:hover {
		background-color: var(--toggleBgColorActiveHovered, hsl(207, 90%, 34%));
	}
	input:disabled + .slider {
		background-color: var(--toggleBgColorActiveHovered, hsl(207, 90%, 34%));
	}
	input:focus + .slider {
		box-shadow: 0 0 2px 3px var(--toggleBgColorActiveHovered, hsl(207, 90%, 34%));
		transition: all 100ms ease-in-out;
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: var(--toggle-height, calc(var(--toggle-scale) * 1.7));
		padding: 1px;
	}
	.slider.round:before {
		border-radius: 50%;
	}
	.label-text {
		max-width: none;
		width: auto;
	}
	.label-text:hover,
	.label-text:focus {
		color: var(--label-text-hover-color, inherit);
	}
	.pointer {
		cursor: pointer;
	}
</style>
