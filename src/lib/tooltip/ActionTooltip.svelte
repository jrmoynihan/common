<svelte:options accessors={true} />

<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { TooltipDirections } from './tooltip-action';
	export let title: string = '';
	export let position: TooltipDirections;
	export let x: number;
	export let y: number;
	export let visible = false;
	export let start = 0;
	export let opacity = 0;
	export let duration = 350;
	export let delay = 100;
	export let offsetHeight: number;
	export let clientHeight: number;
	export let clientWidth: number;
	export let offsetWidth: number;
	export let marginTop: number;
	export let marginLeft: number;
	export let custom_component: unknown | null = null;
	export let show_arrow = true;
	export let keep_visible = false;
	export let css: [string, string][] = [];
	export let only_for_measuring = false;
	let styles: string = '';
	let tooltip_element: HTMLElement | null = null;
	// TODO: expose a way to customize the animation
	// export let transition_type: TransitionConfig;
	// export let transition_params: ScaleParams | FlyParams | BlurParams | FadeParams | SlideParams | DrawParams | CrossfadeParams = { start, opacity, duration, delay };

	$: if (css.length > 0)
		css?.forEach(([key, value]) => {
			styles = styles.concat(`${key}: ${value};`);
		});
	$: marginLeft = tooltip_element ? parseInt(getComputedStyle(tooltip_element).marginLeft) : 0;
	$: marginTop = tooltip_element ? parseInt(getComputedStyle(tooltip_element).marginTop) : 0;
</script>

{#if visible || keep_visible}
	<div
		class="tooltip"
		bind:this={tooltip_element}
		bind:offsetHeight
		bind:clientHeight
		bind:clientWidth
		bind:offsetWidth
		transition:scale={{ start, opacity, duration, delay }}
		class:visible={visible || keep_visible}
		class:nothing={only_for_measuring}
		class:top={position === 'top'}
		class:right={position === 'right'}
		class:left={position === 'left'}
		class:bottom={position === 'bottom'}
		style={`left: ${x}px; top: ${y}px; ${styles}`}
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
{/if}

<style lang="scss">
	.tooltip {
		box-sizing: border-box;
		position: fixed;
		border: var(--tooltip-border, 1px solid #ddd);
		box-shadow: var(--tooltip-shadow, 1px 1px 2px #ddd);
		background-color: var(--tooltip-background-color, white);
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
		max-width: min(var(--tooltip-max-width, calc(100vw - 2rem)), calc(100vw - 2rem));
		text-align: var(--tooltip-text-align, center);
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
			border-color: var(--tooltip-background-color, inherit);
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
