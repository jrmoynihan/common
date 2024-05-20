<script context='module' lang='ts'>
	import type { HTMLAttributes } from "svelte/elements";

    export interface GridProps extends HTMLAttributes<HTMLDivElement> {
        min_column_size?: string
        max_column_size?: string
        min_row_size?: string
        max_row_size?: string
        columns?: number
        rows?: number
        gap?: string
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
		children,
		...attributes
	} : GridProps = $props()
</script>

<div 
	class="grid-parent"
	style:--minColumnSize={min_column_size}
	style:--maxColumnSize={max_column_size}
	style:--minRowSize={min_row_size}
	style:--maxRowSize={max_row_size}
	style:--columns={columns}
	style:--rows={rows}
	style:--gap={gap}
	{...attributes}
	>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.grid-parent {
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(var(--minColumnSize), var(--maxColumnSize)));
		grid-template-rows: repeat(var(--rows), minmax(var(--minRowSize), var(--maxRowSize)));
		gap: var(--gap);
	}
</style>
