<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import { createEventDispatcher, type ComponentProps } from 'svelte';
	import Button from './Button.svelte';

	export let checked = false;
	export let disabled = false;
	export let label_position: 'before' | 'after' = 'before';
	export let label_text = '';
	export let slider_text = '';
	// Add override styles
	export let scale = '1rem';
	export let slider_styles = '';
	export let label_styles = '';
	export let label_hover_styles = '';
	export let label_focus_styles = '';
	export let label_active_styles = '';
	/** Properties of the {@link Button} container.  This is also where you can add an icon. */
	export let button_props: ComponentProps<Button> = {};
	export let bgColorHue: number | null = null; // = 246; // 207;
	export let bgColorSaturation: number | null = null; // = 46; // 90;
	export let bgColorLuminosity: number | null = null; // = 37; // 54;
	export let darkenHoverPercentage: number = 20;
	export let inactiveBgColorHue = 0;
	export let inactiveBgColorSaturation = 0;
	export let inactiveBgColorLuminosity = 27;
	export let inactiveBgColor = `hsl(${inactiveBgColorHue}, ${inactiveBgColorSaturation}%, ${inactiveBgColorLuminosity}%)`;
	export let inactiveBgColorDarken = `hsl(${inactiveBgColorHue}, ${inactiveBgColorSaturation}%, ${
		inactiveBgColorLuminosity - darkenHoverPercentage
	}%)`;
	export let toggleBgColorActive =
		bgColorHue && bgColorSaturation && bgColorLuminosity
			? `hsl(${bgColorHue},${bgColorSaturation}%,${bgColorLuminosity}%)`
			: null;
	export let toggleBgColorActiveHovered =
		bgColorHue && bgColorSaturation && bgColorLuminosity
			? `hsl(${bgColorHue},${bgColorSaturation}%,${bgColorLuminosity - darkenHoverPercentage}%)`
			: null;

	// Create an event dispatcher object
	const dispatch = createEventDispatcher();

	// A function when the input is clicked; dispatches/triggers the event named "toggle" to the parent component
	function toggled() {
		dispatch('toggle', { checked });
	}
</script>

<Button
	on:click={() => {
		checked = !checked;
		toggled();
	}}
	role="switch"
	box_shadow_elevation={'none'}
	{...button_props}
	styles={`border: 0; --scale: ${scale}; display: grid; gap: 0.5rem; --button-padding: 0.2rem; --button-background: var(--toggle-button-background, inherit); --button-hover-background: var(--toggle-button-hover-background, inherit); --button-color: var(--toggle-button-color, inherit); ${button_props.styles}`}
	classes={`toggle ${button_props.classes}`}
>
	{#if label_position === 'before' && label_text !== ''}
		<label
			use:dynamicStyle={{
				styles: label_styles,
				hover_styles: label_hover_styles,
				focus_styles: label_focus_styles,
				active_styles: label_active_styles
			}}
			class="label-text pointer"
			for={'toggle'}
		>
			{label_text}
		</label>
	{/if}
	<span
		class="switch"
		style:--toggleBgColorActive={toggleBgColorActive ?? null}
		style:--toggleBgColorActiveHovered={toggleBgColorActiveHovered ?? null}
		style:--inactiveBgColor={inactiveBgColor ?? null}
		style:--inactiveBgColorDarken={inactiveBgColorDarken ?? null}
	>
		<!-- NOTE: Subtle fix made by changing this to on:change event instead of on:click -->
		<input
			type="checkbox"
			aria-checked={checked}
			{disabled}
			bind:checked
			on:change|stopPropagation={toggled}
		/>
		<span class="slider round" style={slider_styles} data-slider-text={slider_text} />
	</span>
	{#if label_position === 'after' && label_text !== ''}
		<label
			use:dynamicStyle={{
				styles: label_styles,
				hover_styles: label_hover_styles,
				focus_styles: label_focus_styles,
				active_styles: label_active_styles
			}}
			class="label-text pointer"
			for={'toggle'}
		>
			{label_text}
		</label>
	{/if}
</Button>

<!-- </button> -->
<style lang="scss">
	$base-scale: var(--scale, 1rem);

	/* The switch - the box around the slider */
	.switch,
	.label-text {
		position: relative;
		display: flex;
		align-self: center;
		width: calc(#{$base-scale} * 3);
	}
	.switch {
		background: transparent;
		box-shadow: none;
		border: none;
		border-radius: 1em;
		height: var(--toggle-height, calc(#{$base-scale} * 1.7));
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
		height: var(--slider-height, #{$base-scale});
		width: var(--slider-width, #{$base-scale});
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
		border-radius: var(--toggle-height, calc($base-scale * 1.7));
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
