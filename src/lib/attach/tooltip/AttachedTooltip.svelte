<!-- <script module lang="ts">
	import { browser } from '$app/env';

	if (browser && document && !('anchorName' in document?.documentElement.style)) {
		await fetch('https://unpkg.com/@oddbird/css-anchor-positioning');
	}
</script> -->

<!--
@component
https://web.dev/building-a-tooltip-component/
-->

<script lang="ts">
	import type { TooltipProps } from './tooltip.svelte.js';

	let {
		content,
		args,
		position = 'top',
		id = '',
		visible = false,
		show_arrow = true,
		keep_visible = false,
		styles = '',
		distance = 10,
		inert = true,
		disabled = false,
		fallback = true,
		...attributes
	}: TooltipProps = $props();

	let tooltip: HTMLElement | undefined = $state(undefined);
</script>

<!-- NOTE: Use 'inert' attribute unless you need interactivity inside the tip, i.e. a 'toggle-tip' -->
<tool-tip
	bind:this={tooltip}
	{inert}
	data-tip-position={position}
	style:position-anchor={`--${id}`}
	style:--anchor-position={position}
	style:--anchor={id}
	style:--distance={typeof distance === 'number' ? `${distance}px` : distance}
	{...attributes}
	role="tooltip"
	id={`tooltip-${id}`}
	anchor={id}
	popover="auto"
	class={[
		'tooltip',
		{ fallback },
		((!disabled && visible) || keep_visible) && 'visible',
		attributes.class
	]}
>
	{#if content && typeof content === 'string'}
		{content}
	{:else if content && typeof content === 'function'}
		{@render content(args)}
	{/if}

	{#if show_arrow}
		<tooltip-arrow class="arrow" data-tip-position={position}> </tooltip-arrow>
	{/if}
</tool-tip>

<style>
	@layer common.tooltip {
		@position-try --tooltip-top {
			bottom: calc(anchor(top) + var(--distance));
			top: auto;
			justify-self: anchor-center;
			transform-origin: center bottom;
			max-width: min(var(--inline-limit), var(--preferred-max-inline));
			max-height: max-content;
		}

		@position-try --tooltip-bottom {
			top: calc(anchor(bottom) + var(--distance));
			bottom: auto;
			justify-self: anchor-center;
			transform-origin: center top;
			max-width: min(var(--inline-limit), var(--preferred-max-inline));
			max-height: max-content;
		}

		@position-try --tooltip-left {
			right: calc(anchor(left) + var(--distance));
			left: auto;
			align-self: anchor-center;
			transform-origin: right center;
			max-width: max-content;
			max-height: min(var(--block-limit), var(--preferred-max-block));
		}

		@position-try --tooltip-right {
			left: calc(anchor(right) + var(--distance));
			right: auto;
			align-self: anchor-center;
			transform-origin: left center;
			max-width: max-content;
			max-height: min(var(--block-limit), var(--preferred-max-block));
		}

		.tooltip {
			--inline-limit: calc(100vw - 2rem);
			--block-limit: calc(100vh - 2rem);
			--preferred-max-inline: 33ch;
			--preferred-max-block: 53ch;
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
			display: var(--tooltip-display, grid-lanes);
			place-items: var(--tooltip-place-items, center);
			gap: var(--tooltip-gap, 0.25rem);
			opacity: var(--tooltip-opacity, 1);
			color: var(--tooltip-color, var(--text, inherit));
			text-align: var(--tooltip-text-align, center);
			text-wrap: var(--tooltip-text-wrap, pretty);
			z-index: var(--tooltip-z-index, 1000);
			transition: var(--tooltip-transition, all 300ms ease-in-out);
			scale: 0;
			opacity: 0;
			overflow: visible;
			inset: auto;
			height: max-content;
			margin: 0;
			anchor-name: --tooltip;
			anchor-scope: --tooltip;
			container-type: anchored; /* Enable container queries relative to the anchored tooltip */
			max-inline-size: fit-content;
			max-block-size: max-content;
			&.fallback {
				position-try-fallbacks: most-inline-size, most-block-size;
			}

			&[data-tip-position='bottom'] {
				transform-origin: center top;
				top: calc(anchor(bottom) + var(--distance));
				bottom: auto;
				justify-self: anchor-center;
				position-area: bottom center;
				&.fallback {
					position-try-fallbacks: --tooltip-top, --tooltip-left, --tooltip-right;
				}
			}
			&[data-tip-position='top'] {
				transform-origin: center bottom;
				bottom: calc(anchor(top) + var(--distance));
				top: auto;
				justify-self: anchor-center;
				position-area: top center;
				&.fallback {
					position-try-fallbacks: --tooltip-bottom, --tooltip-left, --tooltip-right;
				}
			}
			&[data-tip-position='left'] {
				transform-origin: right center;
				right: calc(anchor(left) + var(--distance));
				left: auto;
				align-self: anchor-center;
				position-area: left center;
				&.fallback {
					position-try-fallbacks: --tooltip-right, --tooltip-top, --tooltip-bottom;
				}
			}
			&[data-tip-position='right'] {
				transform-origin: left center;
				left: calc(anchor(right) + var(--distance));
				right: auto;
				align-self: anchor-center;
				position-area: right center;
				&.fallback {
					position-try-fallbacks: --tooltip-left, --tooltip-top, --tooltip-bottom;
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
	@container anchored(fallback: --tooltip-bottom) {
		.arrow {
			width: var(--side-arrow-base);
			height: var(--side-arrow-length);
			left: auto;
			right: auto;
			top: calc(
				-1 * var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) + -1 *
					var(--arrow-cushion, 4px)
			);

			&::after {
				border-color: transparent;
				border-bottom: var(--arrow-border-and-color);
				border-top-style: unset;
				border-left: var(--arrow-transparent-border);
				border-right: var(--arrow-transparent-border);
			}
		}
	}

	@container anchored(fallback: --tooltip-top) {
		.arrow {
			width: var(--side-arrow-base);
			height: var(--side-arrow-length);
			left: auto;
			right: auto;
			top: calc(100% + -1 * var(--arrow-cushion, 0px));

			&::after {
				border-color: transparent;
				border-top: var(--arrow-border-and-color);
				border-bottom-style: unset;
				border-left: var(--arrow-transparent-border);
				border-right: var(--arrow-transparent-border);
			}
		}
	}

	@container anchored(fallback: --tooltip-left) {
		.arrow {
			width: var(--side-arrow-length);
			height: var(--side-arrow-base);
			top: calc(50% - var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)));
			left: calc(100% + -1 * var(--arrow-cushion, 0px));

			&::after {
				border-color: transparent;
				border-left: var(--arrow-border-and-color);
				border-right-style: unset;
				border-top: var(--arrow-transparent-border);
				border-bottom: var(--arrow-transparent-border);
			}
		}
	}

	@container anchored(fallback: --tooltip-right) {
		.arrow {
			width: var(--side-arrow-length);
			height: var(--side-arrow-base);
			top: calc(50% - var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)));
			left: calc(-1 * var(--tooltip-arrow-width, 0.75rem) + -1 * var(--arrow-cushion, 0px));

			&::after {
				border-color: transparent;
				border-right: var(--arrow-border-and-color);
				border-left-style: unset;
				border-top: var(--arrow-transparent-border);
				border-bottom: var(--arrow-transparent-border);
			}
		}
	}
</style>
