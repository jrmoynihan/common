<!--
@component
https://web.dev/building-a-tooltip-component/
-->

<script lang="ts" generics="T">
	import { dynamic_style } from '$actions/dynamic-styles.svelte.js';
	import type { TooltipProps, TooltipWithContentProps } from './tooltip.svelte';

	let {
		content,
		content_snippet,
		content_args,
		position = 'top',
		id = '',
		visible = false,
		show_arrow = true,
		keep_visible = false,
		styles = '',
		distance = 10,
		inert = true,
		disabled = false,
		fallback = true
	}: TooltipProps<T> & TooltipWithContentProps<T> = $props();

	let tooltip: HTMLElement | undefined = $state(undefined);
</script>

<!-- NOTE: Use 'inert' attribute unless you need interactivity inside the tip, i.e. a 'toggle-tip' -->
<tool-tip
	bind:this={tooltip}
	use:dynamic_style={{ styles }}
	{inert}
	role="tooltip"
	class="tooltip"
	id={`tooltip-${id}`}
	anchor={id}
	popover="auto"
	data-tip-position={position}
	class:visible={(!disabled && visible) || keep_visible}
	class:fallback
	style:--anchor-position={position}
	style:--anchor={id}
	style:--tooltip-width={`${tooltip?.offsetWidth}px`}
	style:--tooltip-height={`${tooltip?.offsetHeight}px`}
	style:--distance={typeof distance === 'number' ? `${distance}px` : distance}
>
	{#if content}
		{#if typeof content === 'string'}
			{content}
		{/if}
	{:else if content_snippet && content_args}
		{@render content_snippet(content_args)}
	{/if}

	{#if show_arrow}
		<tooltip-arrow class="arrow" data-tip-position={position}> </tooltip-arrow>
	{/if}
</tool-tip>

<style>
	@layer tooltip {
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
			max-width: min(
				var(--tooltip-max-width, min(calc(100vw - 2rem)), 250px),
				min(calc(100vw - 2rem), 250px)
			);
			text-align: var(--tooltip-text-align, center);
			text-wrap: var(--tooltip-text-wrap, balance);
			z-index: var(--tooltip-z-index, 1000);
			transition: var(--tooltip-transition, all 300ms ease-in-out);
			scale: 0;
			opacity: 0;
			position: fixed;
			overflow: visible;
			margin: 0;

			&[data-tip-position='bottom'] {
				transform-origin: center top;
				left: calc(anchor(center) - (var(--tooltip-width) * 0.5));
				top: calc(anchor(bottom) + var(--distance));
				bottom: auto;
				&.fallback {
					position-try: flip-block, flip-inline, flip-start;
				}
			}
			&[data-tip-position='top'] {
				transform-origin: center bottom;
				left: calc(anchor(center) - (var(--tooltip-width) * 0.5));
				bottom: calc(anchor(top) + var(--distance));
				top: auto;
				&.fallback {
					position-try: flip-block, flip-inline, flip-start;
				}
			}
			&[data-tip-position='left'] {
				transform-origin: right center;
				right: calc(anchor(left) + var(--distance));
				left: auto;
				top: calc(anchor(center) - (var(--tooltip-height) * 0.5));
				&.fallback {
					position-try: flip-inline, flip-block, flip-start;
				}
			}
			&[data-tip-position='right'] {
				transform-origin: left center;
				left: calc(anchor(right) + var(--distance));
				right: auto;
				top: calc(anchor(center) - (var(--tooltip-height) * 0.5));
				&.fallback {
					position-try: flip-inline, flip-block, flip-start;
				}
			}
			&.visible {
				scale: 1;
				opacity: 1;
			}
		}

		.arrow {
			--side-arrow-length: calc(
				var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) + var(--arrow-cushion, 4px)
			);
			--side-arrow-base: calc(var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) * 2);
			--arrow-transparent-border: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem))
				solid transparent;
			--arrow-border-and-color: var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)) solid
				var(
					--tooltip-arrow-color,
					var(--tooltip-background, var(--tooltip-background-color, white))
				);
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
				width: var(--side-arrow-length);
				height: var(--side-arrow-base);
				top: calc(50% - var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)));

				&::after {
					border-top: var(--arrow-transparent-border);
					border-bottom: var(--arrow-transparent-border);
				}
			}
			&[data-tip-position='bottom'],
			&[data-tip-position='top'] {
				width: var(--side-arrow-base);
				height: var(--side-arrow-length);
				left: calc(50% - var(--tooltip-arrow-width, var(--default-arrow-size, 0.5rem)));

				&::after {
					border-left: var(--arrow-transparent-border);
					border-right: var(--arrow-transparent-border);
				}
			}
			&[data-tip-position='bottom'] {
				top: calc(
					-1 * var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) + -1 *
						var(--arrow-cushion, 4px)
				);
				/* overlap with the tooltip box */

				&::after {
					border-bottom: var(--arrow-border-and-color);
					/* Tailwind's base layer will set `border: 0 solid;` which needs an override on a subsequent layer to avoid this ruining the CSS triangle drawing. */
					border-top-style: unset;
				}
			}
			&[data-tip-position='top'] {
				top: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

				&::after {
					border-top: var(--arrow-border-and-color);
					/* Tailwind's base layer will set `border: 0 solid;` which needs an override on a subsequent layer to avoid this ruining the CSS triangle drawing. */
					border-bottom-style: unset;
				}
			}
			&[data-tip-position='left'] {
				left: calc(100% + -1 * var(--arrow-cushion, 0px)); /* overlap with the tooltip box */

				&::after {
					border-left: var(--arrow-border-and-color);
					/* Tailwind's base layer will set `border: 0 solid;` which needs an override on a subsequent layer to avoid this ruining the CSS triangle drawing. */
					border-right-style: unset;
				}
			}
			&[data-tip-position='right'] {
				left: calc(-1 * var(--tooltip-arrow-width, 0.75rem) + -1 * var(--arrow-cushion, 0px));

				&::after {
					border-right: var(--arrow-border-and-color);
					/* Tailwind's base layer will set `border: 0 solid;` which needs an override on a subsequent layer to avoid this ruining the CSS triangle drawing. */
					border-left-style: unset;
				}
			}
		}
	}
</style>
