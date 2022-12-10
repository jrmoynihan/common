<svelte:options accessors={true} />

<script lang="ts">
	import type { TooltipDirections } from '$tooltip/tooltip-action.js';
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

	export let title: string = '';
	export let position: TooltipDirections;
	export let position_type: 'fixed' | 'absolute' = 'fixed';
	export let x: number;
	export let y: number;
	export let visible = false;
	export let start = 0;
	export let opacity = 0;
	export let duration = 350;
	export let delay = 0;
	export let easing: EasingFunction = cubicInOut;
	export let offsetHeight: number;
	export let clientHeight: number;
	export let clientWidth: number;
	export let offsetWidth: number;
	export let marginTop: number;
	export let marginLeft: number;
	export let marginRight: number;
	export let marginBottom: number;
	export let paddingTop: number;
	export let paddingBottom: number;
	export let paddingLeft: number;
	export let paddingRight: number;
	export let custom_component: unknown | null = null;
	export let show_arrow = true;
	export let keep_visible = false;
	export let css: [string, string][] = [];
	export let only_for_measuring = false;
	export let transition = scale;
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
	let styles: string = '';
	let tooltip_element: HTMLElement | null = null;

	$: {
		if (css.length > 0) styles = '';
		css?.forEach(([key, value]) => {
			styles = styles.concat(`${key}: ${value};`);
		});
	}
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
			transition:transition={transition_config}
			class:visible={visible || keep_visible}
			class:nothing={only_for_measuring}
			tip-position={position}
			style={`left: ${x}px; top: ${y}px; position:${position_type}; ${styles}`}
		>
			{#if title}
				{title}
			{/if}
			{#if custom_component}
				<svelte:component this={custom_component} />
			{/if}
			<!-- {#if !title && !custom_component}
			{/if} -->
			{#if show_arrow}
				<span class="arrow" tip-position={position} />
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
		&[tip-position='left'],
		&[tip-position='right'] {
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
		&[tip-position='bottom'],
		&[tip-position='top'] {
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
		&[tip-position='bottom'] {
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
		&[tip-position='top'] {
			top: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

			&::after {
				border-top: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(
						--tooltip-arrow-color,
						var(--tooltip-background, var(--tooltip-background-color, white))
					);
			}
		}
		&[tip-position='left'] {
			left: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

			&::after {
				border-left: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(
						--tooltip-arrow-color,
						var(--tooltip-background, var(--tooltip-background-color, white))
					);
			}
		}
		&[tip-position='right'] {
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

	[tip-position='bottom'] {
		transform-origin: center top;
	}
	[tip-position='top'] {
		transform-origin: center bottom;
	}
	[tip-position='left'] {
		transform-origin: right center;
	}
	[tip-position='right'] {
		transform-origin: left center;
	}
</style>
