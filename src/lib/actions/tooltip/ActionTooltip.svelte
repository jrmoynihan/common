<svelte:options accessors={true} />

<!--
@component
https://web.dev/building-a-tooltip-component/
-->

<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import type { TooltipDirections } from '$actions/tooltip/tooltip.js';
	import { cubicInOut } from 'svelte/easing';
	import {
		scale,
		type EasingFunction,
		type FadeParams,
		type FlyParams,
		type ScaleParams,
		type SlideParams,
		type TransitionConfig
	} from 'svelte/transition';

	/** The text content of the tooltip.  Will be set as the title attribute after the tooltip is hidden. */
	export let title: string = '';
	/** Choose from top, bottom, right, left anchor positions for the tooltip. */
	export let position: TooltipDirections = 'top';
	export let position_type: 'fixed' | 'absolute' = 'fixed';
	export let x: NonNullable<number> = 0;
	export let y: NonNullable<number> = 0;
	/** Allow the tooltip to start visible when mounted to the DOM and programmatically trigger its visibility. May be useful for e.g. guided tour interactions. */
	export let visible = false;
	export let start = 0;
	export let opacity = 0;
	/** Duration of the in/out transition of the tooltip.  An explicit transition config will override this! */
	export let duration = 400;
	/** Delay the entrnace and exit transition of the tooltip symmetrically.  An explicit transition config's delay property will override this! */
	export let delay = 0;
	/** Easing function of the in/out transition of the tooltip.  An explicit transition config will override this! */
	export let easing: EasingFunction = cubicInOut;
	export let offsetHeight: number = 0;
	export let clientHeight: number = 0;
	export let clientWidth: number = 0;
	export let offsetWidth: number = 0;
	export let marginTop: number = 0;
	export let marginLeft: number = 0;
	export let marginRight: number = 0;
	export let marginBottom: number = 0;
	export let paddingTop: number = 0;
	export let paddingBottom: number = 0;
	export let paddingLeft: number = 0;
	export let paddingRight: number = 0;
	export let custom_component: ConstructorOfATypedSvelteComponent | null = null;
	export let custom_component_props: Record<string, unknown> = {};
	/** Enable or disable the tooltip arrow */
	export let show_arrow = true;
	/** Allow the tooltip to stay visible even after the user moves the mouse outside the parent element. */
	export let keep_visible = false;
	export let only_for_measuring = false;
	/** A Svelte transition to use on the tooltip */
	export let transition = scale;
	/** A transition config for a Svelte transition. Will override delay, duration, easing props on the tooltip action. */
	export let transition_config:
		| ScaleParams
		| FlyParams
		| FadeParams
		| SlideParams
		| TransitionConfig = {
		delay,
		duration,
		easing,
		start,
		opacity
	};
	/** Dynamic styles that can change on the tooltip.  Note: use '--tooltip'-prefixed CSS custom properties wherever possible (e.g. --tooltip-background: 'white' instead of background: 'white'). */
	export let styles: string = '';
	let tooltip_element: HTMLElement | null = null;

	$: marginLeft = tooltip_element ? parseInt(getComputedStyle(tooltip_element).marginLeft) : 0;
	$: marginTop = tooltip_element ? parseInt(getComputedStyle(tooltip_element).marginTop) : 0;
	$: marginBottom = tooltip_element ? parseInt(getComputedStyle(tooltip_element).marginBottom) : 0;
	$: marginRight = tooltip_element ? parseInt(getComputedStyle(tooltip_element).marginRight) : 0;
	$: paddingTop = tooltip_element ? parseInt(getComputedStyle(tooltip_element).paddingTop) : 0;
	$: paddingBottom = tooltip_element
		? parseInt(getComputedStyle(tooltip_element).paddingBottom)
		: 0;
	$: paddingLeft = tooltip_element ? parseInt(getComputedStyle(tooltip_element).paddingLeft) : 0;
	$: paddingRight = tooltip_element ? parseInt(getComputedStyle(tooltip_element).paddingRight) : 0;
</script>

{#if visible || keep_visible}
	{#key position}
		<!-- NOTE: Use 'inert' attribute unless you need interactivity inside the tip, i.e. a 'toggle-tip' -->
		<tool-tip
			inert
			role="tooltip"
			class="tooltip"
			bind:this={tooltip_element}
			bind:offsetHeight
			bind:clientHeight
			bind:clientWidth
			bind:offsetWidth
			use:dynamicStyle={{ styles }}
			transition:transition={transition_config}
			class:visible={visible || keep_visible}
			class:nothing={only_for_measuring}
			data-tip-position={position}
			style={`left: ${x}px; top: ${y}px; position:${position_type}; ${styles}`}
		>
			{#if title}
				{@html title}
			{/if}
			{#if custom_component}
				<svelte:component this={custom_component} {...custom_component_props} />
			{/if}
			{#if show_arrow}
				<span class="arrow" data-tip-position={position} />
			{/if}
		</tool-tip>
	{/key}
{/if}

<style lang="scss">
	.tooltip {
		box-sizing: border-box;
		border: var(--tooltip-border, 1px solid #ddd);
		filter: drop-shadow(var(--tooltip-drop-shadow, 1px 1px 4px hsla(0, 0%, 0%, 0.5)));
		background: var(--tooltip-background, white);
		border-radius: var(--tooltip-border-radius, 4px);
		padding: var(--tooltip-padding, 0.5rem);
		font-size: var(--tooltip-font-size, 0.5rem);
		font-weight: var(--tooltip-font-weight, normal);
		font-family: var(--tooltip-font-family, inherit);
		pointer-events: var(--tooltip-pointer-events, none);
		user-select: var(--tooltip-user-select, none);
		transform: var(--tooltip-transform);
		display: var(--tooltip-display, grid);
		place-items: var(--tooltip-place-items, center);
		gap: var(--tooltip-gap, 0.25rem);
		opacity: var(--tooltip-opacity, 1);
		color: var(--tooltip-color, var(--text, inherit));
		margin: var(--tooltip-margin, 1rem);
		max-width: min(
			var(--tooltip-max-width, min(calc(100vw - 2rem)), 250px),
			min(calc(100vw - 2rem), 250px)
		);
		text-align: var(--tooltip-text-align, center);
		z-index: var(--tooltip-z-index, 1000);
		transition: var(--tooltip-transition, all 300ms ease-in-out);
	}
	.nothing {
		opacity: 0;
		pointer-events: none;
	}
	.arrow {
		position: absolute;
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			filter: drop-shadow(var(--tooltip-shadow, 0px 0px 2px #bbb));
			border-color: var(
				--tooltip-arrow-color,
				var(--tooltip-background, var(--tooltip-background-color, white))
			);
			border-width: var(--default-arrow-size, 0.5rem);
		}
		&[data-tip-position='left'],
		&[data-tip-position='right'] {
			width: calc(
				var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) + var(--arrow-cushion, 4px)
			);
			height: calc(var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) * 2);
			top: calc(50% - var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)));

			&::after {
				border-top: var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) solid transparent;
				border-bottom: var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) solid
					transparent;
			}
		}
		&[data-tip-position='bottom'],
		&[data-tip-position='top'] {
			width: calc(var(--tooltip-arrow-width, calc(var(--default-arrow-size, 0.5rem) * 2)));
			height: calc(
				var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) + var(--arrow-cushion, 4px)
			);
			left: calc(50% - var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)));

			&::after {
				border-left: var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) solid
					transparent;
				border-right: var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) solid
					transparent;
			}
		}
		&[data-tip-position='bottom'] {
			top: calc(
				-1 * var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) + -1 * var(--arrow-cushion, 4px)
			); /* overlap with the tooltip box */

			&::after {
				border-bottom: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(
						--tooltip-arrow-color,
						var(--tooltip-background, var(--tooltip-background-color, white))
					);
			}
		}
		&[data-tip-position='top'] {
			top: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

			&::after {
				border-top: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(
						--tooltip-arrow-color,
						var(--tooltip-background, var(--tooltip-background-color, white))
					);
			}
		}
		&[data-tip-position='left'] {
			left: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

			&::after {
				border-left: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(
						--tooltip-arrow-color,
						var(--tooltip-background, var(--tooltip-background-color, white))
					);
			}
		}
		&[data-tip-position='right'] {
			left: calc(-1 * var(--tooltip-arrow-width, 0.75rem) + -1 * var(--arrow-cushion, 0px));

			&::after {
				border-right: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(
						--tooltip-arrow-color,
						var(--tooltip-background, var(--tooltip-background-color, white))
					);
			}
		}
	}

	[data-tip-position='bottom'] {
		transform-origin: center top;
	}
	[data-tip-position='top'] {
		transform-origin: center bottom;
	}
	[data-tip-position='left'] {
		transform-origin: right center;
	}
	[data-tip-position='right'] {
		transform-origin: left center;
	}
</style>
