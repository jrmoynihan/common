<script context="module" lang="ts">
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
		/** The gap between grid items (default: 1rem. */
		gap?: string;
		/** The overflow of the grid (default: hidden).  */
		overflow?: 'hidden' | 'scroll' | 'auto' | 'visible';
		/** The inline alignment of the grid's content (default: normal). */
		justify_content?:
			| 'normal'
			| 'start'
			| 'end'
			| 'left'
			| 'right'
			| 'center'
			| 'space-between'
			| 'space-around'
			| 'space-evenly';
		/** The inline alignment of the grid items (default: normal). */
		justify_items?:
			| 'auto'
			| 'normal'
			| 'stretch'
			| 'start'
			| 'end'
			| 'left'
			| 'right'
			| 'center'
			| 'baseline';
		/** The inline alignment of the grid element itself (default: normal). */
		justify_self?:
			| 'auto'
			| 'normal'
			| 'stretch'
			| 'start'
			| 'end'
			| 'left'
			| 'right'
			| 'center'
			| 'baseline';
		/** The block alignment of the grid's content (default: normal). */
		align_content?:
			| 'normal'
			| 'start'
			| 'end'
			| 'center'
			| 'stretch'
			| 'baseline'
			| 'space-between'
			| 'space-around'
			| 'space-evenly';
		/** The block alignment of the grid items (default: normal). */
		align_items?: 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
		/** The block alignment of the grid element itself (default: normal). */
		align_self?: 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
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
		gap = '1rem',
		overflow,
		justify_content,
		justify_items,
		justify_self,
		align_content,
		align_items,
		align_self,
		children,
		...attributes
	}: GridProps = $props();
</script>

<div
	class="grid-parent"
	style:--grid-min-column-size={min_column_size}
	style:--grid-max-column-size={max_column_size}
	style:--grid-min-row-size={min_row_size}
	style:--grid-max-row-size={max_row_size}
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
>
	{@render children?.()}
</div>

<style>
	@layer grid {
		.grid-parent {
			display: grid;
			grid-template-columns: repeat(
				var(--grid-columns),
				minmax(var(--grid-min-column-size), var(--grid-max-column-size))
			);
			grid-template-rows: repeat(
				var(--grid-rows),
				minmax(var(--grid-min-row-size), var(--grid-max-row-size))
			);
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
