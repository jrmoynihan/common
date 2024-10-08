<script module lang="ts">
	export interface DataRow<T> {
		datum: T;
		index: number;
	}
	export interface SortColumn<T> {
		key: keyof T;
		index: number;
	}
	export interface HeaderCell<T> extends DataRow<T> {
		key: keyof T;
	}
	export interface DataCell<T> extends HeaderCell<T> {
		value: any;
	}
	export interface TableProps<T> {
		data?: T[];
		/** An snippet representing the table header row(s) (a <tr> element to be rendered within <thead>) */
		header_row?: Snippet<[T]>;
		/** A snippet representing the table header cells (`<th>` elements within `<thead>` `<tr>` rows) */
		header_cell?: Snippet<[HeaderCell<T>]>;
		/** An snippet representing the table data row(s) */
		data_row?: Snippet<[DataRow<T>]>;
		/** A snippet representing the table data cells (`<td>` elements within `<tbody>` `<tr>` rows)*/
		data_cell?: Snippet<[DataCell<T>]>;
		/** An snippet representing the table caption */
		caption?: Snippet<[any]> | null;
		/** The text of the table caption */
		caption_text?: string;
		/** The side of the table caption, with respect to the table */
		caption_side?: 'top' | 'bottom';
		/** An snippet representing the table footer.  By default, it takes in an object of type `DataCell<T>` */
		footer?: Snippet<[any]> | null;
		/** The data of the table footer */
		footer_data?: DataCell<T>;
		/** A list of keys to include from the objects in the `data` array.  If left empty and `omitted_keys` is also left empty, all keys will be included */
		visible_keys?: Array<keyof T>;
		/** A list of keys to omit from the objects in the `data` array.  If left empty and `visible_keys` is also left empty, no keys will be omitted */
		omitted_keys?: Array<keyof T>;
		/** Should the headers be capitalized? */
		capitalize_headers?: boolean;
		/** A snippet representing the button to sort the table column */
		sort_button?: Snippet<[SortColumn<T>]> | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<thead>`, before the keys of the `data` array. Wrap your items in a `<th>` within the snippet. */
		preceding_header_cells?: Snippet | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<thead>`, after the keys of the `data` array. Wrap your items in a `<th>` within the snippet. */
		subsequent_header_cells?: Snippet | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<tbody>`, before the keys of the `data` array.  Wrap your items in a `<td>` within the snippet.  Each item will have access to the `datum` and `index` properties. */
		preceding_data_cells?: Snippet<[DataRow<T>]> | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<tbody>`, after the keys of the `data` array.  Wrap your items in a `<td>` within the snippet.  Each item will have access to the `datum` and `index` properties. */
		subsequent_data_cells?: Snippet<[DataRow<T>]> | null;
	}
</script>

<script lang="ts" generics="T extends Record<string,any>">
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import {
		faArrowDown19,
		faArrowDownAZ,
		faArrowDownWideShort,
		faArrowUp91,
		faArrowUpShortWide,
		faArrowUpZA,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import type { Snippet } from 'svelte';

	let {
		data = $bindable([]),
		header_row = default_header_row,
		header_cell = default_header_cell,
		data_row = default_data_row,
		data_cell = default_data_cell,
		caption = default_caption,
		caption_text,
		caption_side = 'top',
		footer = default_footer,
		visible_keys = $bindable([]),
		omitted_keys = $bindable([]),
		capitalize_headers = true,
		sort_button = default_sort_button,
		preceding_header_cells = null,
		subsequent_header_cells = null,
		preceding_data_cells = null,
		subsequent_data_cells = null
	}: TableProps<T> = $props();

	// Assign icons for sorting; A-Z icons for strings, 1-9 icons for numbers, arrow icons for everything else
	type Ordering = 'asc' | 'desc' | null;
	let orders: Ordering[] = $state(Object.keys(data[0]).map((d) => 'desc'));

	function capitalize(s: string) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}
	function replace_camel_case(s: keyof T): string {
		if (typeof s === 'string') {
			return s.replaceAll('_', ' ');
		} else {
			return s.toString();
		}
	}
	function capitalize_all_words(s: keyof T) {
		if (typeof s === 'string') {
			return replace_camel_case(s).split(' ').map(capitalize).join(' ');
		} else {
			return s.toString();
		}
	}

	function map_icons(obj: T, key: string, order: Ordering = null) {
		if (typeof obj[key] === 'string') {
			return order === 'desc' ? faArrowDownAZ : faArrowUpZA;
		} else if (typeof obj[key] === 'number') {
			return order === 'desc' ? faArrowDown19 : faArrowUp91;
		} else {
			return order === 'desc' ? faArrowDownWideShort : faArrowUpShortWide;
		}
	}

	let icons: IconDefinition[] = $state(Object.keys(data[0]).map((d) => map_icons(data[0], d)));

	function sort_strings({ key, index }: SortColumn<T>) {
		const new_order = change_order(index);
		new_order === 'asc'
			? data.sort((a, b) => b[key].localeCompare(a[key]))
			: data.sort((a, b) => a[key].localeCompare(b[key]));
	}

	function sort_numbers_or_boolean_or_dates({ key, index }: SortColumn<T>) {
		const new_order = change_order(index);
		new_order === 'asc'
			? data.sort((a, b) => b[key] - a[key])
			: data.sort((a, b) => a[key] - b[key]);
	}

	function change_order(index: number): Ordering {
		let order = orders[index];
		const key = Object.keys(data[0])[index];
		if (order === 'asc') {
			orders[index] = 'desc';
			icons[index] = map_icons(data[0], key, 'desc');
		} else {
			orders[index] = 'asc';
			icons[index] = map_icons(data[0], key, 'asc');
		}
		return orders[index];
	}
</script>

{#snippet default_caption(text: string)}
	<caption><h3>{text}</h3></caption>
{/snippet}

{#snippet default_header_row(datum: T)}
	<tr>
		{@render preceding_header_cells?.()}
		{#if datum instanceof Object}
			{#each Object.keys(datum) as k, index}
				{@const key = k as keyof T}
				{@render header_cell({ datum, key, index })}
			{/each}
		{/if}
		{@render subsequent_header_cells?.()}
	</tr>
{/snippet}

{#snippet default_sort_button({ key, index }: SortColumn<T>)}
	{@const datum_0 = data[0][key]}
	{#if typeof datum_0 === 'string'}
		<ButtonRunes
			classes={`sort-button ${orders[index]}`}
			onclick={() => sort_strings({ key, index })}
			style={'padding: 0.25rem;'}
			icon_props={{ icon: icons[index] }}
			tooltip_options={{
				content: `Sort strings (current: ${orders[index] === 'desc' ? 'A-Z' : 'Z-A'})`
			}}
		/>
	{:else if typeof datum_0 === 'number'}
		<ButtonRunes
			classes={`sort-button ${orders[index]}`}
			onclick={() => sort_numbers_or_boolean_or_dates({ key, index })}
			icon_props={{ icon: icons[index] }}
			tooltip_options={{
				content: `Sort numbers (current: ${orders[index] === 'desc' ? 'low-to-high' : 'high-to-low'})`
			}}
		/>
		<!-- TODO: other data types -->
	{/if}
{/snippet}

{#snippet default_data_row({ datum, index }: DataRow<T>)}
	<tr>
		{@render preceding_data_cells?.({ datum, index })}
		{#if datum instanceof Object}
			{#each Object.entries(datum) as [k, value]}
				{@const key = k as keyof T}
				{#if visible_keys.length > 0 && visible_keys.includes(key)}
					{@render data_cell({ datum, key, value, index })}
				{:else if omitted_keys.length > 0 && !omitted_keys.includes(key)}
					{@render data_cell({ datum, key, value, index })}
				{:else if visible_keys.length === 0 && omitted_keys.length === 0 && typeof value !== 'function'}
					{@render data_cell({ datum, key, value, index })}
				{/if}
			{/each}
		{/if}
		{@render subsequent_data_cells?.({ datum, index })}
	</tr>
{/snippet}

{#snippet default_data_cell({ datum, key, value, index }: DataCell<T>)}
	<td>{value}</td>
{/snippet}
{#snippet default_header_cell({ datum, key, index }: HeaderCell<T>)}
	{#if typeof key === 'string' && !omitted_keys?.includes(key) && typeof datum[key] !== 'function'}
		{#if capitalize_headers}
			{#if key === 'id'}
				<th scope="col">
					ID
					{@render sort_button?.({ key: 'id' as keyof T, index })}
				</th>
			{:else}
				<th scope="col">
					{capitalize_all_words(key)}
					{@render sort_button?.({ key, index })}
				</th>
			{/if}
		{:else}
			<th scope="col">
				{key}
				{@render sort_button?.({ key, index })}
			</th>
		{/if}
	{/if}
{/snippet}

{#snippet default_footer(d: DataCell<T>)}
	<tfoot>
		<tr>
			{@render data_cell?.(d)}
		</tr>
	</tfoot>
{/snippet}

<table style:--caption-side={caption_side}>
	{#if caption_text}
		{@render caption?.(caption_text)}
	{/if}

	{#if data.length > 0}
		<thead>
			{@render header_row?.(data[0])}
		</thead>
	{/if}
	<!-- TODO: Add support for virtual list -->
	<tbody>
		{#each data as datum, index (datum)}
			{@render data_row?.({ datum, index })}
		{/each}
	</tbody>
	{@render footer?.(data)}
</table>

<style lang="scss" module="mixed">
	table {
		--table-border-color: hsla(0, 0%, 80%, 0.3);
		--table-cell-padding-inline: 0.5rem;
		--table-cell-padding-block: 0.25rem;
		--table-cell-padding: var(--table-cell-padding-block) var(--table-cell-padding-inline);

		background-color: var(--table-background-color, inherit);
		border-spacing: 0;
		border: 2px solid var(--table-border-color);
		border-radius: var(--table-border-radius);
		width: var(--table-width, auto);
		max-width: var(--table-max-width, 100%);
		margin: var(--table-margin, 1rem 0);

		@media (width < 768px) {
			display: block;
			border-collapse: collapse;
			overflow: auto;
		}

		& > tbody {
			white-space: nowrap;
		}
	}
	caption {
		caption-side: var(--table-caption-side);
		font-weight: var(--table-caption-font-weight, bold);
	}
	th,
	td {
		border: 1px solid var(--table-border-color);
		padding: var(--table-cell-padding);
	}
	th:first-child {
		border-top-left-radius: var(--table-border-radius, inherit);
	}
	th:last-child {
		border-top-right-radius: var(--table-border-radius, inherit);
	}
	:global(tr:last-child > td:first-child) {
		border-bottom-left-radius: var(--table-border-radius, inherit);
	}
	:global(tr:last-child > td:last-child) {
		border-bottom-right-radius: var(--table-border-radius, inherit);
	}

	th {
		background-color: var(--table-header-background-color, inherit);
		color: var(--table-header-color, inherit);
		position: sticky;
		top: 0;
	}
	tr {
		background-color: var(--table-row-background-color, inherit);
		color: var(--table-row-color, inherit);
	}
	td {
		background-color: var(--table-cell-background-color, inherit);
		color: var(--table-cell-color, inherit);
	}
</style>
