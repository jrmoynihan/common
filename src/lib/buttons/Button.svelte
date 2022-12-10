<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import type {
		BoxShadowElevation,
		ButtonType,
		IconSize,
		SvelteTransition,
		SvelteTransitionParams,
		WidgetRole
	} from '$lib/lib_types.js';
	import { tooltip, type TooltipParameters } from '$tooltip/tooltip-action.js';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import { fade } from 'svelte/transition';

	/** Options to style the tooltip or modify its visible/disabled state */
	export let tooltip_options: TooltipParameters = {
		disabled: true
	};
	/** Add role attributes to the button */
	export let role: WidgetRole = 'button';
	/** Style the button, allowing dynamic updates */
	export let styles = '';
	/** External classes to add to the button (typically, these are best done by wrapping a Button and passing in specific styles, making a styled component) */
	export let classes = '';
	/** An array of hover CSS styles rules and values to apply to the button */
	export let hover_styles: string = '';
	/** An array of focus CSS styles rules and values to apply to the button.  (default: uses the same styles as hover state). */
	export let focus_styles: string = hover_styles;
	/** A font-awwesome icon to use inside the button */
	export let icon: IconDefinition | null = null;
	/** The size of the icon */
	export let icon_size: IconSize = 'lg';
	/** The rotation of the icon */
	export let icon_rotation: string | number | undefined = undefined;
	/** Should the icon be positioned before or after the text and slot of the button (default: 'after')*/
	export let icon_position: 'before' | 'after' = 'after';
	/** The title of the button */
	export let title = '';
	/** Whether the button is disabled */
	export let disabled = false;
	/** Plain text to display within the button */
	export let text: string = '';
	/** The type of the button. Possible values are:
	 * * `submit`: The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.
	 * * `reset`: The button resets all the controls to their initial values.
	 * * `button`: The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur. */
	export let type: ButtonType = 'submit';
	/** What height the box-shadows should convey to the element */
	export let box_shadow_elevation: BoxShadowElevation = 'low';
	/** A Svelte transition to use on the button */
	export let transition: SvelteTransition = fade;
	export let transition_config: SvelteTransitionParams = {};
	let hovered: boolean = false;
	let focused: boolean = false;
</script>

<button
	transition:transition={transition_config ?? { duration: 0 }}
	use:dynamicStyle={{ styles, hover_styles, focus_styles }}
	use:tooltip={{ ...tooltip_options }}
	title={title ?? tooltip_options.title}
	{type}
	{role}
	class="btn {classes}"
	class:low={box_shadow_elevation === 'low'}
	class:medium={box_shadow_elevation === 'medium'}
	class:high={box_shadow_elevation === 'high'}
	class:hovered
	class:focused
	style={`${styles}`}
	{disabled}
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:focus={() => (focused = true)}
	on:blur={() => (focused = false)}
	on:click
>
	{#if icon && icon_position === 'before'}
		<Fa {icon} size={icon_size} rotate={icon_rotation} />
	{/if}
	<slot />
	{text}
	{#if icon && icon_position === 'after'}
		<Fa {icon} size={icon_size} rotate={icon_rotation} />
	{/if}
</button>

<style lang="scss">
	button {
		--shadow-color: 242deg 60% 50%;
		--low-elevation-opacity: 0.4;
		--medium-elevation-opacity: 0.2;
		--high-elevation-opacity: 0.1;
		--base: 0.5px;
		--offset-ratio: 2;
		--spread-ratio: 2;
		--crispiness: 1;
		--total-shadows: 3;
		--shadow: 2;
		--blur-ratio: var();
		--color-function-low: hsla(var(--shadow-color), var(--low-elevation-opacity));
		--color-function-medium: hsla(var(--shadow-color), var(--medium-elevation-opacity));
		--color-function-high: hsla(var(--shadow-color), var(--high-elevation-opacity));

		/* 0.4, 0.8, 1, -1.2*/
		--shadow-elevation-low: 0.3px 0.5px 0.7px var(--color-function-low),
			var(--base) calc(var(--base) * var(--offset-ratio)) calc(var(--base) * var(--spread-ratio))
				calc(var(--base)) var(--color-function-low),
			1px 2px 2.5px -2.5px var(--color-function-low);
		--shadow-elevation-medium: 0.3px 0.5px 0.7px var(--color-function-medium),
			0.8px 1.6px 2px -0.8px var(--color-function-medium),
			2.1px 4.1px 5.2px -1.7px var(--color-function-medium),
			5px 10px 12.6px -2.5px var(--color-function-medium);
		--shadow-elevation-high: 0.3px 0.5px 0.7px var(--color-function-high),
			1.5px 2.9px 3.7px -0.4px var(--color-function-high),
			2.7px 5.4px 6.8px -0.7px var(--color-function-high),
			4.5px 8.9px 11.2px -1.1px var(--color-function-high),
			7.1px 14.3px 18px -1.4px var(--color-function-high),
			11.2px 22.3px 28.1px -1.8px var(--color-function-high),
			17px 33.9px 42.7px -2.1px var(--color-function-high),
			25px 50px 62.9px -2.5px var(--color-function-high);

		box-sizing: border-box;
		border-radius: var(--button-border-radius, 1rem);
		padding: var(--button-padding, 1rem);
		color: var(--button-color, inherit);
		background: var(--button-background, inherit);
		opacity: var(--button-opacity, 1);
		transition: var(--button-transition, all 250ms);
		&:hover,
		&:focus-visible {
			cursor: pointer;
			background: var(--button-hover-background, initial);
			box-shadow: var(--button-hover-box-shadow, initial);
			opacity: var(--button-hover-opacity, 1);
			&.low {
				box-shadow: var(--button-hover-box-shadow, var(--shadow-elevation-low));
			}
			&.medium {
				box-shadow: var(--button-hover-box-shadow, var(--shadow-elevation-medium));
			}
			&.high {
				box-shadow: var(--button-hover-box-shadow, var(--shadow-elevation-high));
			}
		}
		&:focus-visible {
			outline: var(--button-hover-outline, -webkit-focus-ring-color auto 1px);
		}
		&:active {
			scale: var(--button-active-scale, 1, 1, 1);
			&.low {
				box-shadow: none;
			}
			&.medium {
				box-shadow: var(--shadow-elevation-low);
			}
			&.high {
				box-shadow: var(--shadow-elevation-medium);
			}
		}
	}
	.low {
		scale: 1.005, 1.005, 1;
		box-shadow: var(--shadow-elevation-low);
	}
	.medium {
		scale: 1.015, 1.015, 1;
		box-shadow: var(--shadow-elevation-medium);
	}
	.high {
		scale: 1.025, 1.025, 1;
		box-shadow: var(--shadow-elevation-high);
	}
	.hovered,
	.focused {
		opacity: 1;
	}
</style>
