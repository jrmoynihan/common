<!--
@component
https://web.dev/building-a-tooltip-component/
-->

<script lang="ts">
	import { browser } from '$app/environment';
	import type { TooltipProps } from './tooltip.svelte.js';

	type Props = TooltipProps & {
		invoker?: HTMLElement;
		invoker_anchor_name?: string | null;
	};

	let {
		content,
		args,
		position = 'top',
		id = '',
		visible = false,
		show_arrow = true,
		keep_visible = false,
		distance = 10,
		inert = true,
		disabled = false,
		fallback = true,
		invoker,
		invoker_anchor_name = null,
		...attributes
	}: Props = $props();

	let tooltip_el: HTMLElement | undefined = $state(undefined);
	let tooltip_width = $state(0);
	let tooltip_height = $state(0);

	$effect(() => {
		if (!browser || !tooltip_el) return;
		const el = tooltip_el;
		const ro = new ResizeObserver(() => {
			tooltip_width = el.offsetWidth;
			tooltip_height = el.offsetHeight;
		});
		ro.observe(el);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (!browser || !tooltip_el) return;
		const el = tooltip_el as HTMLElement & {
			showPopover?: (options?: { source?: HTMLElement }) => void;
			hidePopover?: () => void;
		};
		const should_show = (!disabled && visible) || keep_visible;
		if (!should_show) {
			try {
				if (typeof el.hidePopover === 'function' && el.matches(':popover-open')) {
					el.hidePopover();
				}
			} catch {
				/* ignore */
			}
			return;
		}
		try {
			if (typeof el.showPopover !== 'function') return;
			if (el.matches(':popover-open')) return;
			if (invoker && invoker !== document.body) {
				el.showPopover({ source: invoker });
			} else {
				el.showPopover();
			}
		} catch {
			/* ignore */
		}
	});
</script>

<!-- NOTE: Use 'inert' attribute unless you need interactivity inside the tip, i.e. 'toggle-tip' -->
<tool-tip
	bind:this={tooltip_el}
	{inert}
	data-tip-position={position}
	style:--anchor-position={position}
	style:--tooltip-width={`${tooltip_width}px`}
	style:--tooltip-height={`${tooltip_height}px`}
	style:--distance={typeof distance === 'number' ? `${distance}px` : distance}
	style:position-anchor={invoker_anchor_name ?? undefined}
	{...attributes}
	role="tooltip"
	id={`tooltip-${id}`}
	popover="manual"
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
				justify-self: anchor-center;
				&.fallback {
					position-try-fallbacks: flip-block, flip-inline, flip-start;
				}
			}
			&[data-tip-position='top'] {
				transform-origin: center bottom;
				left: calc(anchor(center) - (var(--tooltip-width) * 0.5));
				bottom: calc(anchor(top) + var(--distance));
				top: auto;
				justify-self: anchor-center;
				&.fallback {
					position-try-fallbacks: flip-block, flip-inline, flip-start;
				}
			}
			&[data-tip-position='left'] {
				transform-origin: right center;
				right: calc(anchor(left) + var(--distance));
				left: auto;
				top: calc(anchor(center) - (var(--tooltip-height) * 0.5));
				align-self: anchor-center;
				&.fallback {
					position-try-fallbacks: flip-inline, flip-block, flip-start;
				}
			}
			&[data-tip-position='right'] {
				transform-origin: left center;
				left: calc(anchor(right) + var(--distance));
				right: auto;
				top: calc(anchor(center) - (var(--tooltip-height) * 0.5));
				align-self: anchor-center;
				&.fallback {
					position-try-fallbacks: flip-inline, flip-block, flip-start;
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
				position-area: bottom span-all;
				top: calc(
					-1 * var(--tooltip-arrow-height, var(--default-arrow-size, 0.5rem)) + -1 *
						var(--arrow-cushion, 4px)
				);

				&::after {
					border-bottom: var(--arrow-border-and-color);
					border-top-style: unset;
				}
			}
			&[data-tip-position='top'] {
				top: calc(100% + -1 * var(--arrow-cushion, 0px));

				&::after {
					border-top: var(--arrow-border-and-color);
					border-bottom-style: unset;
				}
			}
			&[data-tip-position='left'] {
				left: calc(100% + -1 * var(--arrow-cushion, 0px));

				&::after {
					border-left: var(--arrow-border-and-color);
					border-right-style: unset;
				}
			}
			&[data-tip-position='right'] {
				left: calc(-1 * var(--tooltip-arrow-width, 0.75rem) + -1 * var(--arrow-cushion, 0px));

				&::after {
					border-right: var(--arrow-border-and-color);
					border-left-style: unset;
				}
			}
		}
	}
</style>
