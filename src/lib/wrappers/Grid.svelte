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
		/** (Default: 1) The number of columns in the grid, or an `auto-fit` or `auto-fill` algorithm. */
		columns?: number | 'auto-fit' | 'auto-fill';
		/** (Default: 1) The number of rows in the grid, or an `auto-fit` or `auto-fill` algorithm. */
		rows?: number | 'auto-fit' | 'auto-fill';
		/** (Default: 1rem) The gap between grid items. */
		gap?: string;
		/** (Default: hidden) The overflow of the grid. */
		overflow?: 'hidden' | 'scroll' | 'auto' | 'visible';
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
		children,
		...attributes
	}: GridProps = $props();
</script>

<div
	class="grid-parent"
	style:--min-column-size={min_column_size}
	style:--max-column-size={max_column_size}
	style:--min-row-size={min_row_size}
	style:--max-row-size={max_row_size}
	style:--columns={columns}
	style:--rows={rows}
	style:--gap={gap}
	style:overflow
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	@layer grid {
		.grid-parent {
			display: grid;
			grid-template-columns: repeat(
				var(--columns),
				minmax(var(--min-column-size), var(--max-column-size))
			);
			grid-template-rows: repeat(var(--rows), minmax(var(--min-row-size), var(--max-row-size)));
			gap: var(--gap);
		}
	}
</style>
