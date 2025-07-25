<script module lang="ts">
	import type { HTMLAttributes, HTMLTableAttributes } from 'svelte/elements';

	export interface DataRow<T> {
		datum: T;
		index: number;
	}
	export interface HeaderCell<T> extends DataRow<T> {
		key: keyof T;
	}
	export interface DataCell<T> extends HeaderCell<T> {
		value: any;
	}
	export interface TableProps<T> extends HTMLTableAttributes {
		data?: T[] | null;
		/** An snippet representing the table header row(s) (e.g. a `<tr>` element to be rendered within `<thead>`) */
		header_row?: Snippet<[datum: T]>;
		/** A snippet representing the table header cells and how they should be rendered (`<th>` elements within `<thead>` `<tr>` rows).  The default excludes properties on the object that are `typeof === 'function'` and allows capitalization of headers, and then renders the `th` snippet.  */
		header_cell?: Snippet<[params: HeaderCell<T>]>;
		/** An snippet representing the table data row(s) */
		data_row?: Snippet<[params: DataRow<T>]>;
		/** A snippet representing the table data cells (`<td>` elements within `<tbody>` `<tr>` rows)*/
		data_cell?: Snippet<[params: DataCell<T>]>;
		/** An snippet representing the table caption */
		caption?: Snippet<[text: string]> | null;
		/** The text of the table caption */
		caption_text?: string;
		/** The side of the table caption, with respect to the table */
		caption_side?: 'top' | 'bottom';
		/** An snippet representing the table footer.  By default, it takes in all data, of type `DataCell<T>` */
		footer?: Snippet<[params: T[]]> | null;
		/** The data of the table footer */
		footer_data?: DataCell<T>;
		/** A list of keys to include from the objects in the `data` array.  If left empty and `omitted_keys` is also left empty, all keys will be included */
		visible_keys?: Array<keyof T>;
		/** A list of keys to omit from the objects in the `data` array.  If left empty and `visible_keys` is also left empty, no keys will be omitted */
		omitted_keys?: Array<keyof T>;
		/** Should the headers be capitalized? */
		capitalize_headers?: boolean;
		/** A snippet representing the button to sort the table column */
		sort_button?: Snippet<[key: keyof T]> | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<thead>`, before the keys of the `data` array. Wrap your items in a `<th>` within the snippet. */
		preceding_header_cells?: Snippet<[]> | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<thead>`, after the keys of the `data` array. Wrap your items in a `<th>` within the snippet. */
		subsequent_header_cells?: Snippet<[]> | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<tbody>`, before the keys of the `data` array.  Wrap your items in a `<td>` within the snippet.  Each item will have access to the `datum` and `index` properties. */
		preceding_data_cells?: Snippet<[params: DataRow<T>]> | null;
		/** A snippet of items that will be rendered in the `<tr>` element within the `<tbody>`, after the keys of the `data` array.  Wrap your items in a `<td>` within the snippet.  Each item will have access to the `datum` and `index` properties. */
		subsequent_data_cells?: Snippet<[params: DataRow<T>]> | null;
		/** A snippet that will render an `<th>` within the `<thead>` and any snippets passed to it.  This element will receive the `table_header_cell_attributes` spread prop. */
		th?: Snippet<[content: Snippet<[]>]>;
		/** The attributes to be applied to the `<tbody>` element */
		table_body_attributes?: HTMLAttributes<HTMLTableSectionElement>;
		/** The attributes to be applied to the `<thead>` element */
		table_header_attributes?: HTMLAttributes<HTMLTableSectionElement>;
		/** The attributes to be applied to `<th>` elements */
		table_header_cell_attributes?: HTMLAttributes<HTMLTableCellElement>;
	}
</script>

<script lang="ts" generics="T extends Record<string,any>">
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import type { IconProps } from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { SvelteDate, SvelteMap } from 'svelte/reactivity';
	import { tooltip } from '$lib/attach/tooltip/tooltip.svelte';

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
		subsequent_data_cells = null,
		th = default_th,
		table_body_attributes,
		table_header_attributes,
		table_header_cell_attributes,
		...rest
	}: TableProps<T> = $props();

	// Assign icons for sorting; A-Z icons for strings, 1-9 icons for numbers, arrow icons for everything else
	type Ordering = 'asc' | 'desc' | null;
	const orders: SvelteMap<keyof T, Ordering> = $state(
		data && Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
			? new SvelteMap(Object.keys(data[0]).map((d) => [d, 'desc']))
			: new SvelteMap()
	);
	const icons: SvelteMap<keyof T, IconProps['icon']> = $derived.by(() => {
		if (data && Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
			return new SvelteMap(
				Array.from(orders.entries(), ([key, order]) => {
					return [key, map_icons(data[0] as T, key, order)];
				})
			);
		} else {
			return new SvelteMap();
		}
	});

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
		return replace_camel_case(s).split(' ').map(capitalize).join(' ');
	}

	function map_icons(obj: T, key: keyof T, order: Ordering) {
		if (typeof obj[key] === 'string') {
			return order === 'desc' ? 'tabler:sort-ascending-letters' : 'tabler:sort-descending-letters';
		} else if (typeof obj[key] === 'number') {
			return order === 'desc' ? 'fa6-solid:arrow-down-1-9' : 'fa6-solid:arrow-up-9-1';
		} else {
			return order === 'desc' ? 'fa6-solid:arrow-down-wide-short' : 'fa6-solid:arrow-up-short-wide';
		}
	}

	function sort_strings(key: keyof T) {
		const new_order = change_order(key);
		// TODO: Use different sort algorithms for different size data arrays
		new_order === 'asc'
			? data?.sort((a, b) => b[key].localeCompare(a[key]))
			: data?.sort((a, b) => a[key].localeCompare(b[key]));
	}

	function sort_numbers_or_boolean_or_dates(key: keyof T) {
		// TODO: Use different sort algorithms for different size data arrays
		const new_order = change_order(key);
		new_order === 'asc'
			? data?.sort((a, b) => b[key] - a[key])
			: data?.sort((a, b) => a[key] - b[key]);
	}

	function change_order(key: keyof T) {
		let current_order = orders.get(key);
		if (current_order === 'asc') {
			orders.set(key, 'desc');
		} else {
			orders.set(key, 'asc');
		}
		return orders.get(key);
	}
</script>

{#snippet default_caption(text: string)}
	<caption><h3>{text}</h3></caption>
{/snippet}

{#snippet default_header_row(datum: T)}
	<tr>
		{@render preceding_header_cells?.()}
		{#if datum instanceof Object}
			{#if visible_keys.length > 0}
				{#each visible_keys as key, index}
					{#if typeof datum[key] !== 'function'}
						{@render header_cell({ datum, key, index })}
					{/if}
				{/each}
			{:else if omitted_keys.length > 0}
				{#each Object.keys(datum).filter((k) => !omitted_keys.includes(k)) as k, index}
					{@const key = k as keyof T}
					{#if typeof datum[key] !== 'function'}
						{@render header_cell({ datum, key, index })}
					{/if}
				{/each}
			{:else if visible_keys.length === 0 && omitted_keys.length === 0}
				{#each Object.keys(datum) as k, index}
					{@const key = k as keyof T}
					{#if typeof datum[key] !== 'function'}
						{@render header_cell({ datum, key, index })}
					{/if}
				{/each}
			{/if}
		{/if}
		{@render subsequent_header_cells?.()}
	</tr>
{/snippet}

{#snippet default_sort_button(key: keyof T)}
	{@const datum_0 = data?.[0]?.[key] as string | number | boolean | bigint | object}
	{@const icon = icons.get(key) ?? 'fa6-solid:arrow-down-wide-short'}
	{@const order = orders.get(key)}
	{#if typeof datum_0 === 'string'}
		<ButtonRunes
			class={['sort-button', order]}
			onclick={() => sort_strings(key)}
			style={'padding: 0.25rem;'}
			icon_props={{ icon }}
			{@attach tooltip({
				content: `Sort strings (current: ${order === 'desc' ? 'A-Z' : 'Z-A'})`
			})}
		/>
	{:else if typeof datum_0 === 'number' || typeof datum_0 === 'boolean' || datum_0 instanceof Date || datum_0 instanceof BigInt || datum_0 instanceof SvelteDate}
		<ButtonRunes
			class={['sort-button', order]}
			onclick={() => sort_numbers_or_boolean_or_dates(key)}
			icon_props={{ icon }}
			{@attach tooltip({
				content: `Sort numbers (current: ${order === 'desc' ? 'low-to-high' : 'high-to-low'})`
			})}
		/>
		<!-- TODO: other data types -->
	{/if}
{/snippet}

{#snippet default_data_row({ datum, index }: DataRow<T>)}
	<tr>
		{@render preceding_data_cells?.({ datum, index })}
		{#if datum instanceof Object}
			{#if visible_keys.length > 0}
				<!-- Visible keys can the provide the order of the columns, since you're already providing a finite set -->
				{#each visible_keys as key}
					{@const value = datum[key]}
					{@render data_cell({ datum, key, value, index })}
				{/each}
			{:else if omitted_keys.length > 0}
				{#each Object.keys(datum).filter((k) => !omitted_keys.includes(k)) as k}
					{@const key = k as keyof T}
					{@const value = datum[k]}
					{@render data_cell({ datum, key, value, index })}
				{/each}
			{:else if visible_keys.length === 0 && omitted_keys.length === 0}
				{#each Object.keys(datum) as k}
					{@const key = k as keyof T}
					{@const value = datum[k]}
					{#if typeof value !== 'function'}
						{@render data_cell({ datum, key, value, index })}
					{/if}
				{/each}
			{/if}
		{/if}
		{@render subsequent_data_cells?.({ datum, index })}
	</tr>
{/snippet}

{#snippet default_th(content: Snippet)}
	<th scope="col" {...table_header_cell_attributes}>
		{@render content?.()}
	</th>
{/snippet}
{#snippet normal_th_content(key: keyof T)}
	<th scope="col" {...table_header_cell_attributes}>
		{#if key === 'id'}
			ID
		{:else}
			{key}
		{/if}
		{@render sort_button?.(key)}
	</th>
{/snippet}
{#snippet capitalized_th_content(key: keyof T)}
	<th scope="col" {...table_header_cell_attributes}>
		{capitalize_all_words(key)}
		{@render sort_button?.(key)}
	</th>
{/snippet}

{#snippet default_data_cell<T>({ datum, key, value, index }: DataCell<T>)}
	<td>{value}</td>
{/snippet}
{#snippet default_header_cell({ datum, key, index }: HeaderCell<T>)}
	{#if key && typeof key === 'string' && !omitted_keys?.includes(key) && typeof datum[key] !== 'function'}
		{#if capitalize_headers}
			{#if key === 'id'}
				{@render normal_th_content(key)}
			{:else if key}
				{@render capitalized_th_content(key)}
			{/if}
		{:else}
			{@render normal_th_content(key)}
		{/if}
	{/if}
{/snippet}

{#snippet default_footer<T>(data: T[])}
	<tfoot>
		<tr>
			<td colspan={visible_keys ? visible_keys.length : data[0] ? Object.keys(data[0]).length : 0}>
				{data.length} items
			</td>
		</tr>
	</tfoot>
{/snippet}

<table style:--caption-side={caption_side} {...rest}>
	{#if caption_text}
		{@render caption?.(caption_text)}
	{/if}

	{#if data && data.length > 0}
		<thead {...table_header_attributes}>
			{@render header_row?.(data[0] as T)}
		</thead>
	{/if}
	<!-- TODO: Add support for virtual list -->
	<tbody {...table_body_attributes}>
		{#if data}
			{#each data as datum, index (datum)}
				{@render data_row?.({ datum, index })}
			{/each}
		{/if}
	</tbody>
	{#if data}
		{@render footer?.(data)}
	{:else}
		{@render footer?.([])}
	{/if}
</table>

<style module="mixed">
	@layer common.table {
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
		thead {
			position: sticky;
			top: 0;
			z-index: 1;
		}
		caption {
			caption-side: var(--table-caption-side);
			font-weight: var(--table-caption-font-weight, bold);
		}
		th,
		td {
			border: 1px solid var(--table-border-color);
			padding: var(--table-cell-padding);
			font-size: var(--table-font-size, var(--font-size-fluid-0)); /* open-props */
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
		}
		tr {
			background-color: var(--table-row-background-color, inherit);
			color: var(--table-row-color, inherit);
		}
		td {
			background-color: var(--table-cell-background-color, inherit);
			color: var(--table-cell-color, inherit);
		}
	}
</style>
