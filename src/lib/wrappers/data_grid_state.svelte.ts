import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'finite';

export interface DataColumn<T> {
	/** The key of the column. Can be a string or a keyof T. If a string, used to access the property (supports dot path). */
	key: string | keyof T;
	/** Accessor for the column. Overrides key-based resolution when present. */
	accessor?: (item: T) => unknown;
	/** Column type; drives filter UI and comparison. */
	type?: ColumnType;
	/** Header label. */
	title?: string;
	sortable?: boolean;
	filterable?: boolean;
	hidden?: boolean;
	/** Options for type 'finite' (and boolean) filter. */
	options?: string[] | { value: string; label: string }[];
	/** When true, finite filter uses radio (single). When false/omit, checkboxes (multi, OR match). */
	finite_single_select?: boolean;
	header_cell_snippet?: Snippet<[DataColumn<T>]>;
	data_cell_snippet?: Snippet<[T, number]>;
	/** CSS grid track size (e.g. "minmax(10rem, 1fr)", "min-content"). */
	width?: string;
	/** Icon name (e.g. Iconify) for filter chip when filter_ui is chip-popover. */
	icon?: string;
	header_attributes?: HTMLAttributes<HTMLDivElement>;
	data_cell_attributes?: HTMLAttributes<HTMLDivElement>;
}

export interface FilterState {
	[key: string]: {
		value?: unknown;
		min?: number;
		max?: number;
		values?: string[];
	};
}

export type FilterUI = 'inline' | 'chip-popover';

export class SortState<T> {
	key: keyof T | string | null = $state(null);
	direction: 'asc' | 'desc' = $state('desc');
}
