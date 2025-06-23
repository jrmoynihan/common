<script module lang="ts">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte';
	import {
		tooltip,
		type TooltipProps,
		type TooltipWithContentProps
	} from '$actions/tooltip/tooltip.svelte';
	import type {
		align_content_options,
		align_items_options,
		align_self_options,
		justify_content_options,
		justify_items_options,
		justify_self_options,
		overflow_options
	} from '$functions/helpers.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface GridProps extends HTMLAttributes<HTMLDivElement> {
		/** The min column size of the grid for a `minmax()` function. */
		min_column_size?: string;
		/** The max column size of the grid for a `minmax()` function. */
		max_column_size?: string;
		/** The min row size of the grid for a `minmax()` function. */
		min_row_size?: string;
		/** The max row size of the grid for a `minmax()` function. */
		max_row_size?: string;
		/** The number of columns in the grid, or an `auto-fit` or `auto-fill` algorithm (default: 1). */
		columns?: number | 'auto-fit' | 'auto-fill';
		/** The number of rows in the grid, or an `auto-fit` or `auto-fill` algorithm (default: 1). */
		rows?: number | 'auto-fit' | 'auto-fill';
		/** The template areas of the grid. */
		template_areas?: string;
		/** The gap between grid items (default: 1rem. */
		gap?: string;
		/** The overflow of the grid (default: hidden).  */
		overflow?: keyof typeof overflow_options;
		/** The inline alignment of the grid's content (default: normal). */
		justify_content?: keyof typeof justify_content_options;
		/** The inline alignment of the grid items (default: normal). */
		justify_items?: keyof typeof justify_items_options;
		/** The inline alignment of the grid element itself (default: normal). */
		justify_self?: keyof typeof justify_self_options;
		/** The block alignment of the grid's content (default: normal). */
		align_content?: keyof typeof align_content_options;
		/** The block alignment of the grid items (default: normal). */
		align_items?: keyof typeof align_items_options;
		/** The block alignment of the grid element itself (default: normal). */
		align_self?: keyof typeof align_self_options;
		/** Options to style the tooltip or modify its visible/disabled state */
		tooltip_props?: TooltipProps | TooltipWithContentProps;
		/** Style the button, allowing dynamic updates */
		dynamic_styles?: DynamicStyleParameters;
	}
</script>

<script lang="ts">
	let {
		min_column_size = '0',
		max_column_size = '1fr',
		min_row_size = 'auto',
		max_row_size = '1fr',
		columns = 1,
		rows = 1,
		template_areas,
		gap = '1rem',
		overflow,
		justify_content,
		justify_items,
		justify_self,
		align_content,
		align_items,
		align_self,
		children,
		tooltip_props = { disabled: true, visible: false },
		dynamic_styles,
		...attributes
	}: GridProps = $props();
</script>

<div
	use:dynamic_style={dynamic_styles}
	use:tooltip={tooltip_props}
	style:--grid-min-column-size={min_column_size}
	style:--grid-max-column-size={max_column_size}
	style:--grid-min-row-size={min_row_size}
	style:--grid-max-row-size={max_row_size}
	style:--grid-template-areas={template_areas}
	style:--grid-columns={columns}
	style:--grid-rows={rows}
	style:--grid-gap={gap}
	style:--grid-justify-content={justify_content}
	style:--grid-justify-items={justify_items}
	style:--grid-justify-self={justify_self}
	style:--grid-align-content={align_content}
	style:--grid-align-items={align_items}
	style:--grid-align-self={align_self}
	style:--grid-overflow={overflow}
	{...attributes}
	class={['_grid-parent', attributes.class]}
>
	{@render children?.()}
</div>

<style>
	@layer common.grid {
		._grid-parent {
			display: grid;
			grid-template-columns: repeat(
				var(--grid-columns),
				minmax(var(--grid-min-column-size), var(--grid-max-column-size))
			);
			grid-template-rows: repeat(
				var(--grid-rows),
				minmax(var(--grid-min-row-size), var(--grid-max-row-size))
			);
			grid-template-areas: var(--grid-template-areas);
			gap: var(--grid-gap);
			justify-content: var(--grid-justify-content);
			justify-items: var(--grid-justify-items);
			justify-self: var(--grid-justify-self);
			align-content: var(--grid-align-content);
			align-items: var(--grid-align-items);
			align-self: var(--grid-align-self);
			overflow: var(--grid-overflow);
		}
	}
</style>
