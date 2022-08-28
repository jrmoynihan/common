<script lang="ts">
	import Fa from 'svelte-fa';
	import { tooltip, type TooltipParameters } from '$lib/tooltip';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import type { SvelteComponentTyped } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { IconSize, SvelteTransition, SvelteTransitionParams } from '$lib/lib_types';
	import { browser } from '$app/environment';

	/** Options to style the tooltip or modify its visible/disabled state */
	export let tooltip_options: TooltipParameters = {
		disabled: true
	};
	/** Styles that won't change/update on the button */
	export let static_styles = '';
	let styles = static_styles;
	/** External classes to add to the button (typically, these are best done by wrapping a Button and passing in specific styles, making a styled component) */
	export let classes = '';
	/** An array of dynamic CSS style rules and values  to apply to the button.  They will change when these variables change */
	export let dynamic_styles: [string, string][] = [];
	/** An array of hover CSS styles rules and values to apply to the button */
	export let hover_styles: [string, string][] = [];
	/** An array of focus CSS styles rules and values to apply to the button.  (default: uses the same styles as hover state). */
	export let focus_styles: [string, string][] = hover_styles;
	/** A font-awwesome icon to use inside the button */
	export let icon: IconDefinition | null = null;
	/** The size of the icon */
	export let icon_size: IconSize = 'lg';
	/** The title of the button */
	export let title = '';
	/** Whether the button is disabled */
	export let disabled = false;
	/** Plain text to display within the button */
	export let text: string = '';
	/** Custom component to display within the button. Best for dynamic components within the button.  Static components can just drop in the button's slot. */
	export let component: SvelteComponentTyped | null = null;
	/** Whether to use box-shadows */
	export let box_shadow: 'low' | 'medium' | 'high' | 'none' = 'low';
	/** A Svelte transition to use on the button */
	export let transition: SvelteTransition = fade;
	export let transition_config: SvelteTransitionParams = { duration: 0 };
	let button: HTMLButtonElement;
	let hovered: boolean = false;
	let focused: boolean = false;

	$: {
		if (dynamic_styles.length > 0) styles = static_styles;
		dynamic_styles?.forEach(([key, value]) => {
			styles = styles.concat(`${key}: ${value};`);
		});
	}
	$: {
		if (hover_styles.length > 0 && hovered && button && browser) {
			hover_styles?.forEach(([key, value]) => {
				button.style.setProperty(key, value);
			});
		} else if (!hovered && button && browser) {
			hover_styles?.forEach(([key, value]) => {
				button.style.removeProperty(key);
			});
			// Re-apply styles that should stay
			styles = static_styles;
		}
	}
	// $: {
	// 	if (focus_styles.length > 0 && focused && button && browser) {
	// 		focus_styles?.forEach(([key, value]) => {
	// button.style.setProperty(key, value);
	// 		});
	// 	} else if (!focused && button && browser) {
	// 		focus_styles?.forEach(([key, value]) => {
	// button.style.removeProperty(key)
	// 		});
	// 		// Re-apply styles that should stay
	// 		styles = static_styles;
	// 	}
	// }
</script>

<button
	bind:this={button}
	transition:transition={transition_config}
	use:tooltip={{ ...tooltip_options }}
	title={title ?? tooltip_options.title}
	class="btn {classes}"
	class:low={box_shadow === 'low'}
	class:medium={box_shadow === 'medium'}
	class:high={box_shadow === 'high'}
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
	<slot />
	{#if component}
		<svelte:component this={component} />
	{/if}
	{text}
	{#if icon}
		<Fa {icon} size={icon_size} />
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

		/* 0.4, 0.8, 1, -1.2*/
		--shadow-elevation-low: 0.3px 0.5px 0.7px
				hsl(var(--shadow-color) / var(--low-elevation-opacity)),
			var(--base) calc(var(--base) * var(--offset-ratio)) calc(var(--base) * var(--spread-ratio))
				calc(var(--base) -) hsl(var(--shadow-color) / var(--low-elevation-opacity)),
			1px 2px 2.5px -2.5px hsl(var(--shadow-color) / var(--low-elevation-opacity));
		--shadow-elevation-medium: 0.3px 0.5px 0.7px
				hsl(var(--shadow-color) / var(--medium-elevation-opacity)),
			0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / var(--medium-elevation-opacity)),
			2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / var(--medium-elevation-opacity)),
			5px 10px 12.6px -2.5px hsl(var(--shadow-color) / var(--medium-elevation-opacity));
		--shadow-elevation-high: 0.3px 0.5px 0.7px
				hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			1.5px 2.9px 3.7px -0.4px hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			2.7px 5.4px 6.8px -0.7px hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			4.5px 8.9px 11.2px -1.1px hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			7.1px 14.3px 18px -1.4px hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			11.2px 22.3px 28.1px -1.8px hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			17px 33.9px 42.7px -2.1px hsl(var(--shadow-color) / var(--high-elevation-opacity)),
			25px 50px 62.9px -2.5px hsl(var(--shadow-color) / var(--high-elevation-opacity));

		box-sizing: border-box;
		border-radius: var(--button-border-radius, 1rem);
		padding: var(--button-padding, 1rem);
		color: var(--button-color, inherit);
		background: var(--button-background, inherit);
		transition: var(--button-transition, all 250ms);
		&:hover,
		&:focus-visible {
			cursor: pointer;
			background: var(--button-hover-background, initial);
			box-shadow: var(--button-hover-box-shadow, initial);
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
			transform: scale3d(1, 1, 1);
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
		transform: scale3d(1.005, 1.005, 1);
		box-shadow: var(--shadow-elevation-low);
	}
	.medium {
		transform: scale3d(1.015, 1.015, 1);
		box-shadow: var(--shadow-elevation-medium);
	}
	.high {
		transform: scale3d(1.025, 1.025, 1);
		box-shadow: var(--shadow-elevation-high);
	}
	.hovered,
	.focused {
		opacity: 1;
	}
</style>
