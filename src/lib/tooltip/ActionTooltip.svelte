<svelte:options accessors={true} />

<script lang="ts">
	import {
		scale,
		type EasingFunction,
		type FadeParams,
		type FlyParams,
		type ScaleParams,
		type SlideParams,
		type TransitionConfig
	} from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import type { TooltipDirections } from '$lib/tooltip/tooltip-action.js';

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
		<div
			class="tooltip"
			bind:this={tooltip_element}
			bind:offsetHeight
			bind:clientHeight
			bind:clientWidth
			bind:offsetWidth
			transition:transition={transition_config}
			class:visible={visible || keep_visible}
			class:nothing={only_for_measuring}
			class:top={position === 'top'}
			class:right={position === 'right'}
			class:left={position === 'left'}
			class:bottom={position === 'bottom'}
			style={`left: ${x}px; top: ${y}px; position:${position_type}; ${styles}`}
		>
			{#if title}
				{title}
			{/if}
			{#if custom_component}
				<svelte:component this={custom_component} />
			{/if}
			{#if !title && !custom_component}
				No tooltip or component provided
			{/if}
			{#if show_arrow}
				<span
					class="arrow"
					class:bottom={position === 'bottom'}
					class:top={position === 'top'}
					class:left={position === 'left'}
					class:right={position === 'right'}
				/>
			{/if}
		</div>
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
			border-color: var(--tooltip-background, var(--tooltip-background-color, inherit));
		}
		&.left,
		&.right {
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
		&.bottom,
		&.top {
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
		&.bottom {
			top: calc(
				-1 * var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) + -1 * var(--arrow-cushion, 4px)
			); /* overlap with the tooltip box */

			&::after {
				border-bottom: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(--tooltip-background-color, white);
			}
		}
		&.top {
			top: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

			&::after {
				border-top: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(--tooltip-background-color, white);
			}
		}
		&.left {
			left: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

			&::after {
				border-left: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(--tooltip-background-color, white);
			}
		}
		&.right {
			left: calc(-1 * var(--tooltip-arrow-width, 0.75rem) + -1 * var(--arrow-cushion, 0px));

			&::after {
				border-right: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
					var(--tooltip-background-color, white);
			}
		}
	}

	.bottom {
		transform-origin: center top;
	}
	.top {
		transform-origin: center bottom;
	}
	.left {
		transform-origin: right center;
	}
	.right {
		transform-origin: left center;
	}
</style>
