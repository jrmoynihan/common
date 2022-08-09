<svelte:options accessors={true} />

<script lang="ts">
	// import type { SvelteComponent } from 'svelte/internal';

	import { scale } from 'svelte/transition';
	export let title: string;
	export let position: 'top' | 'bottom' | 'left' | 'right';
	export let x: number;
	export let y: number;
	export let visible = false;
	export let start = 0;
	export let opacity = 0;
	export let duration = 350;
	export let delay = 100;
	export let offsetHeight = 0;
	export let clientHeight = 0;
	export let clientWidth = 0;
	export let offsetWidth = 0;
	export let custom_component: unknown | null = null;
	export let show_arrow = true;
</script>

{#if visible}
	<div
		class="tooltip"
		bind:offsetHeight
		bind:clientHeight
		bind:clientWidth
		bind:offsetWidth
		transition:scale={{ start, opacity, duration, delay }}
		class:visible
		class:top={position === 'top'}
		class:right={position === 'right'}
		class:left={position === 'left'}
		class:bottom={position === 'bottom'}
		style={`left: ${x}px; top: ${y}px;`}
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
		border: var(--tooltip-border, 1px solid #ddd);
		box-shadow: var(--tooltip-shadow, 1px 1px 2px #ddd);
		background-color: var(--tooltip-background-color, white);
		border-radius: var(--tooltip-border-radius, 4px);
		padding: var(--tooltip-padding, 0.5rem);
		font-size: var(--tooltip-font-size, 0.5rem);
		font-weight: var(--tooltip-font-weight, normal);
		font-family: var(--tooltip-font-family, inherit);
		position: fixed;
		pointer-events: none;
		transform: var(--tooltip-transform);
		display: var(--tooltip-display, grid);
		gap: var(--tooltip-gap, 0.25rem);
		opacity: var(--tooltip-opacity, 1);
		color: var(--tooltip-color, var(--text, inherit));
	}
	.arrow {
		position: absolute;
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			filter: drop-shadow(var(--tooltip-shadow, 0px 0px 2px #bbb));
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
