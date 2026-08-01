<!-- <script module lang="ts">
	import { browser } from '$app/env';

	if (browser && document && !('anchorName' in document?.documentElement.style)) {
		await fetch('https://unpkg.com/@oddbird/css-anchor-positioning');
	}
</script> -->

<!--
@component
CSS Anchor Positioning tooltip.

Public CSS custom properties (set on the tip via `style` / inherited from a parent):

**Tip chrome**
- `--tooltip-background`, `--tooltip-color`, `--tooltip-border`, `--tooltip-border-radius`
- `--tooltip-padding`, `--tooltip-font-size`, `--tooltip-font-weight`, `--tooltip-font-family`
- `--tooltip-drop-shadow`, `--tooltip-z-index`, `--tooltip-transition`, `--tooltip-gap`
- `--tooltip-display`, `--tooltip-place-items` (layout of tip *content*; does not move the arrow)
- `--distance` (gap from the anchor; also settable via the `distance` prop)

**Arrow**
- `--tooltip-arrow-size` — primary size token (default `0.5rem`)
- `--tooltip-arrow-width` — depth along the pointing axis (defaults to `--tooltip-arrow-size`)
- `--tooltip-arrow-height` — half of the cross-axis base (defaults to `--tooltip-arrow-size`; full base = `2 × height`)
- `--tooltip-arrow-cushion` — how far the arrow overlaps the tip edge (default `0px`)
- `--tooltip-arrow-offset` — cross-axis nudge from center (default `0px`; positive = toward end/bottom)
- `--tooltip-arrow-color` — defaults to `--tooltip-background`

Legacy aliases (still honored): `--default-arrow-size` → size, `--arrow-cushion` → cushion,
`--tooltip-shadow` → arrow drop-shadow, `--tooltip-background-color` → background.

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
		style = '',
		distance = 10,
		inert = true,
		disabled = false,
		fallback = true,
		...attributes
	}: TooltipProps = $props();

	let tooltip: HTMLElement | undefined = $state(undefined);

	const tip_style = $derived(
		[style, typeof attributes.style === 'string' ? attributes.style : ''].filter(Boolean).join('; ')
	);

	/** Fallback arrow rules when `position-try` flips the tip. Uses `:where()` so consumers can override without fighting ID specificity. */
	function tooltipFallbackCss() {
		return `
	@container anchored(fallback: --tooltip-bottom) {
		:where(#tooltip-${id}) > .arrow {
			width: var(--_arrow-base);
			height: var(--_arrow-length);
			left: calc(50% + var(--_arrow-offset));
			right: auto;
			translate: -50% 0;
			top: calc(-1 * var(--_arrow-length));
		}
		:where(#tooltip-${id}) > .arrow::after {
			border-color: transparent;
			border-bottom: var(--_arrow-fill-border);
			border-top-style: unset;
			border-left: var(--_arrow-clear-border);
			border-right: var(--_arrow-clear-border);
		}
	}

	@container anchored(fallback: --tooltip-top) {
		:where(#tooltip-${id}) > .arrow {
			width: var(--_arrow-base);
			height: var(--_arrow-length);
			left: calc(50% + var(--_arrow-offset));
			right: auto;
			translate: -50% 0;
			top: calc(100% - var(--_arrow-cushion));
		}
		:where(#tooltip-${id}) > .arrow::after {
			border-color: transparent;
			border-top: var(--_arrow-fill-border);
			border-bottom-style: unset;
			border-left: var(--_arrow-clear-border);
			border-right: var(--_arrow-clear-border);
		}
	}

	@container anchored(fallback: --tooltip-left) {
		:where(#tooltip-${id}) > .arrow {
			width: var(--_arrow-length);
			height: var(--_arrow-base);
			top: calc(50% + var(--_arrow-offset));
			translate: 0 -50%;
			left: calc(100% - var(--_arrow-cushion));
		}
		:where(#tooltip-${id}) > .arrow::after {
			border-color: transparent;
			border-left: var(--_arrow-fill-border);
			border-right-style: unset;
			border-top: var(--_arrow-clear-border);
			border-bottom: var(--_arrow-clear-border);
		}
	}

	@container anchored(fallback: --tooltip-right) {
		:where(#tooltip-${id}) > .arrow {
			width: var(--_arrow-length);
			height: var(--_arrow-base);
			top: calc(50% + var(--_arrow-offset));
			translate: 0 -50%;
			left: calc(-1 * var(--_arrow-length));
		}
		:where(#tooltip-${id}) > .arrow::after {
			border-color: transparent;
			border-right: var(--_arrow-fill-border);
			border-left-style: unset;
			border-top: var(--_arrow-clear-border);
			border-bottom: var(--_arrow-clear-border);
		}
	}
	`;
	}
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
	style={tip_style || undefined}
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
		<tooltip-arrow class="arrow" data-tip-position={position}></tooltip-arrow>
	{/if}
</tool-tip>

<!-- TODO: Hack into the document head until the CSS transformer supports it:
	https://github.com/parcel-bundler/lightningcss/issues/1176
-->
<svelte:head>
	{@html '<sty' + 'le>' + tooltipFallbackCss() + '</' + 'style>'}
</svelte:head>

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
			background: var(--tooltip-background, var(--tooltip-background-color, white));
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
				opacity: var(--tooltip-opacity, 1);
			}
		}

		.arrow {
			/*
			 * Resolved arrow tokens (private). Consumers set the public `--tooltip-arrow-*` vars
			 * on `.tooltip` / ancestors; these internal names stay stable for fallback CSS too.
			 */
			--_arrow-size: var(--tooltip-arrow-size, var(--default-arrow-size, 0.5rem));
			--_arrow-depth: var(--tooltip-arrow-width, var(--_arrow-size));
			--_arrow-half-base: var(--tooltip-arrow-height, var(--_arrow-size));
			--_arrow-base: calc(var(--_arrow-half-base) * 2);
			--_arrow-cushion: var(--tooltip-arrow-cushion, var(--arrow-cushion, 0px));
			--_arrow-offset: var(--tooltip-arrow-offset, 0px);
			--_arrow-length: calc(var(--_arrow-depth) + var(--_arrow-cushion));
			--_arrow-fill: var(
				--tooltip-arrow-color,
				var(--tooltip-background, var(--tooltip-background-color, white))
			);
			--_arrow-clear-border: var(--_arrow-depth) solid transparent;
			--_arrow-fill-border: var(--_arrow-depth) solid var(--_arrow-fill);

			position: absolute;
			overflow: hidden;
			pointer-events: none;

			&:after {
				content: '';
				position: absolute;
				inset: 0;
				filter: drop-shadow(var(--tooltip-shadow, 0px 0px 2px #bbb));
				/* Tailwind preflight sets `border: 0 solid`; per-side borders below override. */
				border-style: solid;
				border-width: 0;
				border-color: transparent;
			}

			/* Cross-axis centering is explicit so `--tooltip-display` / `--tooltip-place-items` do not move the arrow. */
			&[data-tip-position='left'],
			&[data-tip-position='right'] {
				width: var(--_arrow-length);
				height: var(--_arrow-base);
				top: calc(50% + var(--_arrow-offset));
				translate: 0 -50%;

				&:after {
					border-top: var(--_arrow-clear-border);
					border-bottom: var(--_arrow-clear-border);
				}
			}
			&[data-tip-position='bottom'],
			&[data-tip-position='top'] {
				width: var(--_arrow-base);
				height: var(--_arrow-length);
				left: calc(50% + var(--_arrow-offset));
				translate: -50% 0;

				&:after {
					border-left: var(--_arrow-clear-border);
					border-right: var(--_arrow-clear-border);
				}
			}
			&[data-tip-position='bottom'] {
				top: calc(-1 * var(--_arrow-length));

				&:after {
					border-bottom: var(--_arrow-fill-border);
					border-top-style: unset;
				}
			}
			&[data-tip-position='top'] {
				top: calc(100% - var(--_arrow-cushion));

				&:after {
					border-top: var(--_arrow-fill-border);
					border-bottom-style: unset;
				}
			}
			&[data-tip-position='left'] {
				left: calc(100% - var(--_arrow-cushion));

				&:after {
					border-left: var(--_arrow-fill-border);
					border-right-style: unset;
				}
			}
			&[data-tip-position='right'] {
				left: calc(-1 * var(--_arrow-length));

				&:after {
					border-right: var(--_arrow-fill-border);
					border-left-style: unset;
				}
			}
		}
	}
</style>
