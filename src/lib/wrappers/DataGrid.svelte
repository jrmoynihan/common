<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SortState, type DataColumn, type FilterState, type FilterUI } from './data_grid_state.svelte';
	export { SortState, type DataColumn, type FilterState, type FilterUI } from './data_grid_state.svelte';

	export interface DataGridProps<T> {
		data: T[];
		columns: (DataColumn<T> & { key: string | keyof T })[];
		virtual?: boolean;
		row_key?: keyof T | string | ((item: T) => string | number);
		row_snippet?: Snippet<[T, number]>;
		empty_state_snippet?: Snippet;
		header_snippet?: Snippet;
		footer_snippet?: Snippet;
		footer_children?: Snippet;
		hide_header?: boolean;
		selected_id?: string | number | null;
		selected_cell?: number | null;
		header_attributes?: HTMLAttributes<HTMLDivElement>;
		grid_template_columns?: string;
		filter_ui?: FilterUI;
	}
</script>

<script lang="ts" generics="T">
	import NumericInput from '$inputs/NumericInput.svelte';
	import Select from '$inputs/Select.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import VirtualList from '@humanspeak/svelte-virtual-list';
	import Icon from '@iconify/svelte';

	function is_num_set(n: unknown): n is number {
		return typeof n === 'number' && !Number.isNaN(n);
	}

	const POPOVER_GAP_PX = 6;

	let {
		data = [],
		columns = [],
		virtual = false,
		row_key = 'id',
		row_snippet,
		empty_state_snippet,
		header_snippet,
		footer_snippet,
		footer_children,
		hide_header = false,
		selected_id = $bindable(null),
		selected_cell = $bindable(null),
		header_attributes,
		grid_template_columns,
		filter_ui = 'chip-popover'
	}: DataGridProps<T> = $props();

	const VISIBLE_COLUMNS = $derived.by(() => columns.filter((c) => !c.hidden));

	const initial_filter_state = $derived.by(() =>
		columns.reduce((acc, col) => {
			acc[String(col.key)] = {
				value: '',
				min: undefined,
				max: undefined,
				values: []
			};
			return acc;
		}, {} as FilterState)
	);
	let FILTERS = $state<FilterState>({});
	$effect(() => {
		const initial = initial_filter_state;
		const prev = FILTERS;
		const next = { ...prev };
		let changed = false;
		for (const k of Object.keys(initial)) {
			const slot = initial[k];
			if (!(k in next) && slot !== undefined) {
				next[k] = slot;
				changed = true;
			}
		}
		if (changed) FILTERS = next;
	});
	const EFFECTIVE_FILTERS: FilterState = $derived.by(() => ({
		...initial_filter_state,
		...FILTERS
	}));

	let finite_search = $state<Record<string, string>>({});

	const SORT = new SortState<T>();

	function get_filter_summary(
		col: DataColumn<T> & { key: string | keyof T },
		filter: { value?: unknown; min?: number; max?: number; values?: string[] } | undefined
	): string {
		if (!filter) return '';
		const key = String(col.key);
		if (col.type === 'string' && typeof filter.value === 'string' && filter.value.trim()) {
			return filter.value.length > 12
				? `contains: ${filter.value.slice(0, 10)}…`
				: `contains: ${filter.value}`;
		}
		if (col.type === 'number') {
			const { min, max } = filter;
			if (is_num_set(min) && is_num_set(max)) return `${min}–${max}`;
			if (is_num_set(min)) return `≥ ${min}`;
			if (is_num_set(max)) return `≤ ${max}`;
			return '';
		}
		if (col.type === 'date') {
			const { min, max } = filter;
			const fmt = (ts: number) => {
				const d = new Date(ts * 1000);
				const m = d.toLocaleDateString(undefined, { month: 'short' });
				return `${m}-${d.getDate()}-${String(d.getFullYear()).slice(2)}`;
			};
			if (is_num_set(min) && is_num_set(max)) return `${fmt(min)} → ${fmt(max)}`;
			if (is_num_set(min)) return `From ${fmt(min)}`;
			if (is_num_set(max)) return `To ${fmt(max)}`;
			return '';
		}
		if (col.type === 'finite' && filter.values?.length) {
			const opts = col.options;
			const labels = filter.values.map((v) => {
				if (!opts) return v;
				const o = Array.isArray(opts)
					? opts.find((x) => (typeof x === 'object' ? x.value === v : x === v))
					: null;
				return typeof o === 'object' ? (o?.label ?? v) : v;
			});
			return labels.length > 2 ? `${labels.length} selected` : labels.join(', ');
		}
		if (
			(col.type === 'finite' || col.type === 'boolean') &&
			filter.value !== undefined &&
			filter.value !== null &&
			filter.value !== ''
		) {
			const opts = col.options;
			if (opts) {
				const o = Array.isArray(opts)
					? opts.find((x) =>
							typeof x === 'object' ? x.value === filter.value : x === filter.value
						)
					: null;
				const label = typeof o === 'object' ? o?.label : o;
				return label != null ? String(label) : String(filter.value);
			}
			return String(filter.value);
		}
		return '';
	}

	function position_popover_fallback(popover: HTMLElement, trigger: HTMLElement) {
		const rect = trigger.getBoundingClientRect();
		popover.style.top = `${rect.bottom + POPOVER_GAP_PX}px`;
		popover.style.left = `${rect.left}px`;
		popover.style.minWidth = `${Math.max(rect.width, 192)}px`;
	}

	function handle_column_popover_toggle(e: ToggleEvent) {
		if (e.newState !== 'open') return;
		const popover = e.target as HTMLElement;
		const trigger = popover.parentElement?.querySelector<HTMLElement>(
			`[popovertarget="${popover.id}"]`
		);
		if (!trigger) return;
		if (!CSS.supports('top', 'anchor(bottom)')) {
			position_popover_fallback(popover, trigger);
		} else {
			popover.style.minWidth = `${Math.max(trigger.getBoundingClientRect().width, 192)}px`;
		}
		requestAnimationFrame(() => {
			const first = popover.querySelector<HTMLInputElement | HTMLSelectElement>(
				'input:not([type="hidden"]), select'
			);
			first?.focus();
		});
	}

	const RESOLVED_GRID_COLUMNS = $derived.by(() => {
		if (grid_template_columns) return grid_template_columns;
		const widths = VISIBLE_COLUMNS.map((c) => c.width ?? 'minmax(0, 1fr)');
		return widths.length
			? widths.join(' ')
			: `repeat(${VISIBLE_COLUMNS.length}, minmax(150px, 1fr))`;
	});

	const USE_COLUMN_COUNT_FOR_GRID = $derived(
		!grid_template_columns && VISIBLE_COLUMNS.every((c) => !c.width)
	);
	const RESOLVED_GRID_TEMPLATE = $derived(
		USE_COLUMN_COUNT_FOR_GRID ? undefined : RESOLVED_GRID_COLUMNS
	);
	const TABLE_COLUMN_COUNT = $derived(
		USE_COLUMN_COUNT_FOR_GRID ? VISIBLE_COLUMNS.length : undefined
	);

	function resolve_property(object: unknown, property_path: string): unknown {
		if (!object) return undefined;
		return property_path
			.split('.')
			.reduce((o: unknown, p) => (o ? (o as Record<string, unknown>)[p] : undefined), object);
	}

	function get_value(item: T, column: DataColumn<T>) {
		if (column.accessor) {
			return column.accessor(item);
		}
		return resolve_property(item, String(column.key));
	}

	export const get_row_id = (
		item: T,
		row_key: keyof T | string | ((item: T) => string | number),
		index: number
	): string | number => {
		if (typeof row_key === 'function') {
			return row_key(item);
		}
		const val = resolve_property(item, String(row_key));
		if (val !== undefined && val !== null) return val as string | number;
		if ((item as { id?: string | number }).id !== undefined)
			return (item as { id: string | number }).id;
		return index;
	};

	const FILTERED_DATA = $derived.by(() => {
		const eff = EFFECTIVE_FILTERS;
		const has_any = Object.values(eff).some(
			(f) =>
				(f.value !== undefined && f.value !== '' && f.value !== null) ||
				is_num_set(f.min) ||
				is_num_set(f.max) ||
				(f.values !== undefined && f.values.length > 0)
		);
		if (!has_any) return data;

		return data.filter((row) => {
			return columns.every((col) => {
				const filter = eff[String(col.key)];
				if (!filter) return true;

				const val = get_value(row, col);

				if (col.type === 'string' && typeof filter.value === 'string' && filter.value) {
					return String(val).toLowerCase().includes(filter.value.toLowerCase());
				}

				if (col.type === 'finite') {
					if (filter.values?.length) return filter.values.includes(String(val));
					if (filter.value) return val === filter.value;
				}

				if (col.type === 'number' || col.type === 'date') {
					const v = val ?? (col.type === 'number' ? -Infinity : new Date(0));
					let matches = true;
					if (is_num_set(filter.min) && (v as number) < filter.min) matches = false;
					if (is_num_set(filter.max) && (v as number) > filter.max) matches = false;
					return matches;
				}

				if (col.type === 'boolean' && filter.value !== undefined && filter.value !== null) {
					return val === filter.value;
				}

				return true;
			});
		});
	});

	const SORTED_DATA = $derived.by(() => {
		if (!SORT.key) return FILTERED_DATA;
		const sortCol = columns.find((c) => c.key === SORT.key);
		return [...FILTERED_DATA].sort((a, b) => {
			const valA = sortCol ? get_value(a, sortCol) : resolve_property(a, String(SORT.key));
			const valB = sortCol ? get_value(b, sortCol) : resolve_property(b, String(SORT.key));
			if (valA === valB) return 0;
			if (valA === null || valA === undefined) return 1;
			if (valB === null || valB === undefined) return -1;
			if (valA < valB) return SORT.direction === 'asc' ? -1 : 1;
			if (valA > valB) return SORT.direction === 'asc' ? 1 : -1;
			return 0;
		});
	});

	function toggle_sort(key: keyof T | string) {
		if (SORT.key === key) {
			SORT.direction = SORT.direction === 'asc' ? 'desc' : 'asc';
		} else {
			SORT.key = key;
			SORT.direction = 'asc';
		}
	}

	function handle_row_click(id: string | number) {
		if (selected_id === id) {
			selected_id = null;
		} else {
			selected_id = id;
		}
	}
	export const filtered_data = () => FILTERED_DATA;
	export const sorted_data = () => SORTED_DATA;
</script>

{#snippet row(item: T, index: number)}
	{#if row_snippet}
		{@render row_snippet(item, index)}
	{:else}
		{#each columns.filter((c) => !c.hidden) as col}
			<div
				{...col.data_cell_attributes}
				class={['table-cell', col.data_cell_attributes?.class]}
				role="gridcell"
				tabindex="0"
				onpointerdown={() => handle_row_click(get_row_id(item, row_key, index))}
			>
				{#if col.data_cell_snippet}
					{@render col.data_cell_snippet(item, index)}
				{:else}
					{get_value(item, col)}
				{/if}
			</div>
		{/each}
	{/if}
{/snippet}

{#snippet option_snippet(option: string | { value: string; label: string })}
	{#if typeof option === 'object'}
		<option value={option.value}>{option.label}</option>
	{:else}
		<option value={option}>{option}</option>
	{/if}
{/snippet}

<div
	class="data-grid-container"
	role="table"
	aria-label="Data Grid"
	style="height: 100%;"
	style:--table-column-count={TABLE_COLUMN_COUNT ?? VISIBLE_COLUMNS.length}
	style:--table-grid-template-columns={RESOLVED_GRID_TEMPLATE}
>
	{#if header_snippet}
		<div class="data-grid-custom-header">
			{@render header_snippet()}
		</div>
	{/if}
	{#if !hide_header}
		<div
			role="rowgroup"
			{...header_attributes}
			class={['data-grid-header sticky top-0 z-2 grid gap-1 p-0.5', header_attributes?.class]}
		>
			{#each VISIBLE_COLUMNS as col}
				<div
					{...col.header_attributes}
					class={['header-cell', col.header_attributes?.class]}
					role="columnheader"
					aria-sort={SORT.key === col.key
						? SORT.direction === 'asc'
							? 'ascending'
							: 'descending'
						: 'none'}
				>
					{#if col.header_cell_snippet}
						{@render col.header_cell_snippet(col)}
					{:else if col.filterable && filter_ui === 'chip-popover'}
						{@const key = String(col.key)}
						{@const popover_id = `${key}-filter-popover`}
						{@const anchor_name = `--filter-col-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
						{@const summary = get_filter_summary(col, EFFECTIVE_FILTERS[key])}
						{@const has_filter = summary.length > 0}
						{@const filter = EFFECTIVE_FILTERS[key]}
						<div class="header-top header-top-chip">
							{#if col.sortable}
								<button
									class="flex cursor-pointer items-center rounded-lg p-1 transition-colors duration-200 hover:bg-(--primary-60a) hover:text-(--light-text)"
									onclick={() => toggle_sort(col.key)}
									aria-label={SORT.key === col.key
										? SORT.direction === 'asc'
											? 'Sort ascending'
											: 'Sort descending'
										: `Sort by ${col.title ?? key}`}
								>
									<Icon
										icon={SORT.key === col.key && SORT.direction === 'desc'
											? 'fa6-solid:arrow-down'
											: 'fa6-solid:arrow-up'}
										class={{ dim: SORT.key !== col.key }}
									/>
								</button>
							{/if}
							<div class="filter-chip-popover-wrap" style="anchor-name: {anchor_name};">
								<button
									type="button"
									popovertarget={popover_id}
									popovertargetaction="toggle"
									class="filter-bar-chip header-filter-chip"
									class:filter-bar-chip-active={has_filter}
									class:header-filter-chip-summary-below={(col.type === 'date' ||
										col.type === 'string') &&
										has_filter}
									aria-expanded="false"
									aria-controls={popover_id}
									aria-haspopup="dialog"
									aria-label={col.title ? `Filter ${col.title}` : `Filter ${key}`}
								>
									<span class="filter-bar-chip-head">
										{#if col.icon}
											<Icon icon={col.icon} class="header-filter-chip-icon" />
										{/if}
										<span class="filter-bar-chip-label">{col.title ?? String(key)}</span>
									</span>
									{#if summary}
										<span class="filter-bar-chip-summary">{summary}</span>
									{/if}
								</button>
								<div
									id={popover_id}
									popover="auto"
									class="filter-bar-popover header-filter-popover"
									role="dialog"
									style="position-anchor: {anchor_name};"
									aria-label={col.title ? `${col.title} filter` : `${key} filter`}
									ontoggle={handle_column_popover_toggle}
								>
									{#if filter}
										<div class="header-filter-popover-content">
											<header class="header-filter-popover-header">
												<span class="header-filter-popover-title">{col.title ?? String(key)}</span>
												<button
													type="button"
													class="header-filter-clear"
													onclick={() => {
														FILTERS = {
															...FILTERS,
															[key]: {
																value: '',
																min: undefined,
																max: undefined,
																values: []
															}
														};
													}}
													aria-label="Clear filter"
												>
													Clear
												</button>
											</header>
											{#if col.type === 'string'}
												<input
													type="search"
													class="header-filter-string-input"
													placeholder="Search…"
													list={col.options ? `${key}-datalist-popover` : undefined}
													value={filter.value ?? ''}
													oninput={(e) => {
														const v = (e.currentTarget as HTMLInputElement).value;
														FILTERS = { ...FILTERS, [key]: { ...filter, value: v } };
													}}
													aria-label={col.title ? `Filter ${col.title}` : `Filter ${key}`}
												/>
												{#if col.options}
													<datalist id={`${key}-datalist-popover`}>
														{#each col.options as option}
															{@render option_snippet(option)}
														{/each}
													</datalist>
												{/if}
											{:else if col.type === 'number'}
												<div class="header-filter-range">
													<label class="header-filter-date-label">
														Min
														<input
															type="number"
															class="w-full rounded border px-2 py-1 text-sm"
															value={filter.min ?? ''}
															oninput={(e) => {
																const v = (e.currentTarget as HTMLInputElement).value;
																const min = v === '' ? undefined : Number(v);
																FILTERS = {
																	...FILTERS,
																	[key]: { ...filter, min: Number.isNaN(min) ? undefined : min }
																};
															}}
															aria-label={`${col.title ?? key} min`}
														/>
													</label>
													<label class="header-filter-date-label">
														Max
														<input
															type="number"
															class="w-full rounded border px-2 py-1 text-sm"
															value={filter.max ?? ''}
															oninput={(e) => {
																const v = (e.currentTarget as HTMLInputElement).value;
																const max = v === '' ? undefined : Number(v);
																FILTERS = {
																	...FILTERS,
																	[key]: { ...filter, max: Number.isNaN(max) ? undefined : max }
																};
															}}
															aria-label={`${col.title ?? key} max`}
														/>
													</label>
												</div>
											{:else if col.type === 'date'}
												<div class="header-filter-date-range">
													<label class="header-filter-date-label">
														From
														<input
															type="date"
															class="w-full rounded border px-2 py-1 text-sm"
															value={filter.min != null
																? new Date(filter.min * 1000).toISOString().slice(0, 10)
																: ''}
															oninput={(e) => {
																const v = (e.currentTarget as HTMLInputElement).value;
																const min = v
																	? Math.floor(new Date(v).getTime() / 1000)
																	: undefined;
																FILTERS = { ...FILTERS, [key]: { ...filter, min } };
															}}
															aria-label={`${col.title ?? key} from`}
														/>
													</label>
													<label class="header-filter-date-label">
														To
														<input
															type="date"
															class="w-full rounded border px-2 py-1 text-sm"
															value={filter.max != null
																? new Date(filter.max * 1000).toISOString().slice(0, 10)
																: ''}
															oninput={(e) => {
																const v = (e.currentTarget as HTMLInputElement).value;
																const max = v
																	? Math.floor(new Date(v).getTime() / 1000)
																	: undefined;
																FILTERS = { ...FILTERS, [key]: { ...filter, max } };
															}}
															aria-label={`${col.title ?? key} to`}
														/>
													</label>
												</div>
											{:else if (col.type === 'finite' || col.type === 'boolean') && col.options}
												{@const opt_list = col.options as
													| string[]
													| { value: string; label: string }[]}
												{@const search_val = finite_search[popover_id] ?? ''}
												{@const filtered_opts = opt_list.filter((o) => {
													const label = typeof o === 'object' ? o.label : o;
													return (
														!search_val.trim() ||
														String(label).toLowerCase().includes(search_val.toLowerCase())
													);
												})}
												{#if !col.finite_single_select}
													<input
														type="search"
														class="header-filter-finite-search mb-2 w-full rounded border px-2 py-1 text-sm"
														placeholder="Search options…"
														value={search_val}
														oninput={(e) => {
															finite_search = {
																...finite_search,
																[popover_id]: (e.currentTarget as HTMLInputElement).value
															};
														}}
														aria-label="Search options"
													/>
												{/if}
												<div
													class="header-filter-finite-options max-h-48 overflow-y-auto"
													role={col.finite_single_select ? 'radiogroup' : undefined}
													aria-label={col.finite_single_select
														? (col.title ?? String(key))
														: undefined}
												>
													{#if col.finite_single_select}
														<label class="header-filter-finite-option">
															<input
																type="radio"
																name={`finite-${key}-${popover_id}`}
																checked={!filter.value}
																onchange={() => {
																	FILTERS = {
																		...FILTERS,
																		[key]: { ...filter, value: '', values: [] }
																	};
																}}
															/>
															<span>All</span>
														</label>
													{/if}
													{#each filtered_opts as opt}
														{@const opt_val = typeof opt === 'object' ? opt.value : opt}
														{@const opt_label = typeof opt === 'object' ? opt.label : opt}
														{#if col.finite_single_select}
															{@const is_selected = filter.value === opt_val}
															<label class="header-filter-finite-option">
																<input
																	type="radio"
																	name={`finite-${key}-${popover_id}`}
																	checked={is_selected}
																	onchange={() => {
																		FILTERS = {
																			...FILTERS,
																			[key]: {
																				...filter,
																				value: is_selected ? '' : opt_val,
																				values: []
																			}
																		};
																	}}
																/>
																<span>{opt_label}</span>
															</label>
														{:else}
															{@const is_checked = filter.values?.includes(opt_val) ?? false}
															<label class="header-filter-finite-option">
																<input
																	type="checkbox"
																	checked={is_checked}
																	onchange={() => {
																		const next = filter.values ?? [];
																		const next_arr = is_checked
																			? next.filter((v) => v !== opt_val)
																			: [...next, opt_val];
																		FILTERS = {
																			...FILTERS,
																			[key]: { ...filter, value: '', values: next_arr }
																		};
																	}}
																/>
																<span>{opt_label}</span>
															</label>
														{/if}
													{/each}
												</div>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<div class="header-top item-center grid justify-between gap-1">
							<span>{col.title ?? String(col.key)}</span>
							{#if col.sortable}
								<button
									class="flex cursor-pointer items-center justify-end rounded-lg p-1 transition-colors duration-200 hover:bg-(--primary-60a) hover:text-(--light-text)"
									onclick={() => toggle_sort(col.key)}
								>
									<Icon
										icon={SORT.key === col.key && SORT.direction === 'desc'
											? 'fa6-solid:arrow-down'
											: 'fa6-solid:arrow-up'}
										class={{ dim: SORT.key !== col.key }}
									/>
								</button>
							{/if}
						</div>
						{#if col.filterable && filter_ui === 'inline'}
							{@const key = String(col.key)}
							{#if FILTERS[key]}
								<div class="filter-input">
									{#if col.type === 'string'}
										<TextInput
											type="search"
											--input-label-hover-background-color="transparent"
											label_props={{ class: 'hover:bg-transparent p-1 hover:bg-transparent' }}
											list={col.options ? `${key}-datalist` : undefined}
											show_cancel={false}
											show_confirm={false}
											style="border-style: inset;"
											class="rounded-lg border-2 border-(--AZ-gold) bg-white px-1 py-0.5"
											placeholder="Filter..."
											bind:value={FILTERS[key].value}
										/>
										{#if col.options}
											<datalist id={`${key}-datalist`}>
												{#each col.options as option}
													{@render option_snippet(option)}
												{/each}
											</datalist>
										{/if}
									{:else if col.type === 'number'}
										<div class="range">
											<NumericInput
												type="number"
												label_props={{ class: 'hover:bg-transparent', placeholder: 'Min' }}
												class="mx-1 rounded-lg border-2 border-(--AZ-gold) bg-white px-1 py-0.5"
												style="border-style: inset;"
												placeholder_props={{ placeholder: 'min', class: 'text-inherit' }}
												bind:value={FILTERS[key].min}
												show_spinner_buttons={false}
											/>
											<NumericInput
												type="number"
												label_props={{ class: 'hover:bg-transparent', placeholder: 'Max' }}
												class="mx-1 rounded-lg border-2 border-(--AZ-gold) bg-white px-1 py-0.5"
												style="border-style: inset;"
												bind:value={FILTERS[key].max}
												show_spinner_buttons={false}
											/>
										</div>
									{:else if col.type === 'finite' && col.options}
										<Select
											--input-label-hover-background-color="transparent"
											class="m-0.5 rounded-xl border-2 border-(--AZ-gold) p-1 focus-within:outline-(--AZ-gold) focus-visible:outline-2"
											style="border-style: inset;"
											--input-valid-outline="1px inset var(--AZ-gold)"
											bind:value={FILTERS[key].value}
										>
											<option value="">All</option>
											{#each col.options as opt}
												{@render option_snippet(opt)}
											{/each}
										</Select>
									{/if}
								</div>
							{/if}
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="data-grid-body" role="rowgroup" style="height: 100%;">
		{#if SORTED_DATA.length === 0}
			{@render empty_state_snippet?.()}
		{:else if virtual}
			<VirtualList items={SORTED_DATA}>
				{#snippet renderItem(item: T, index: number)}
					{@const row_id = get_row_id(item, row_key, index)}
					{@const even = index % 2 === 0}
					<div
						role="row"
						style:--table-column-count={VISIBLE_COLUMNS.length}
						class={['row-wrapper', { selected: row_id === selected_id, even }]}
						onclick={() => handle_row_click(row_id)}
						onkeydown={(e) => e.key === 'Enter' && handle_row_click(row_id)}
						tabindex="0"
					>
						{@render row(item, index)}
					</div>
				{/snippet}
			</VirtualList>
		{:else}
			{#each SORTED_DATA as item, index (get_row_id(item, row_key, index))}
				{@const row_id = get_row_id(item, row_key, index)}
				{@const even = index % 2 === 0}
				<div
					class={['row-wrapper', { selected: row_id === selected_id, even }]}
					onclick={(e) => e.target === e.currentTarget && handle_row_click(row_id)}
					onkeydown={(e) => e.key === 'Enter' && handle_row_click(row_id)}
					role="button"
					tabindex="0"
				>
					{@render row(item, index)}
				</div>
			{/each}
		{/if}
	</div>
</div>
{#if footer_snippet}
	{@render footer_snippet()}
{:else if footer_children}
	<footer class="data-grid-custom-footer sticky bottom-0 rounded-lg p-2">
		<span>Showing {SORTED_DATA.length} of {data.length} items</span>
		{@render footer_children?.()}
	</footer>
{:else}
	<footer class="data-grid-footer sticky bottom-0 rounded-lg p-2">
		<span>Showing {SORTED_DATA.length} of {data.length} items</span>
	</footer>
{/if}

<style>
	.data-grid-container {
		display: grid;
		grid-template-rows: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
		border: 1px solid #ccc;
		border-radius: 8px;
		overflow: auto;
		max-width: 90%;
		padding: 0 1rem 1rem;
		box-sizing: border-box;
	}
	.data-grid-header,
	.row-wrapper {
		--gap: 0.5rem;
		display: grid;
		grid-template-columns: var(
			--table-grid-template-columns,
			repeat(var(--table-column-count), minmax(150px, 1fr))
		);
		align-items: center;
		gap: var(--gap, 0.5rem);
		min-width: 100%;
		width: fit-content;
	}
	.header-cell,
	.table-cell {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.data-grid-header {
		padding-block: 1rem 0.5rem;
		margin-block-end: 1rem;
	}
	.data-grid-footer {
		background: linear-gradient(to top, var(--background) 80%, transparent 120%);
	}
	.header-cell {
		font-weight: bold;
	}
	.header-top {
		grid-template-columns: auto 1fr;
	}
	.data-grid-body {
		flex: 1;
		position: relative;
	}

	.row-wrapper {
		border-radius: 0.5rem;
		cursor: pointer;
		border-bottom: 1px solid #eee;
		transition:
			background,
			outline 0.2s;
		align-items: center;
		&:hover {
			outline: 1.5px solid oklch(from var(--AZ-mulberry) calc(l * 0.8) calc(c * 1.3) h / 0.5);
		}
		&.even {
			background: var(--even-row-background, var(--primary-20a));
		}
		&.selected,
		&.selected:hover {
			color: var(--light-text);
			background: oklch(from var(--primary) calc(l * 0.8) calc(c * 1.3) h / 0.5);
			border-left: 4px solid var(--primary, #2196f3);
		}
		& .table-cell {
			max-width: 100%;
			overflow: auto;
			padding-block: var(--cell-padding-block, var(--cell-padding, 0.5rem));
			padding-inline: var(--cell-padding-inline, var(--cell-padding, var(--gap, 0.25rem)));
		}
	}
	.range {
		display: flex;
		gap: 0.25rem;
	}

	.header-top-chip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
	}
	.filter-chip-popover-wrap {
		display: inline-flex;
		align-items: center;
	}
	.header-cell .filter-bar-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.8125rem;
		font-weight: 400;
		border-radius: var(--radius, 0.375rem);
		border: 1px solid var(--primary, #2196f3);
		background: var(--primary, #2196f3);
		color: var(--light-text, #fff);
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}
	.header-cell .filter-bar-chip:hover {
		background: var(--primary-hover, oklch(from var(--primary) calc(l * 0.5) c h));
		border-color: var(--primary-hover);
	}
	.header-cell .filter-bar-chip-active {
		border-color: var(--light-primary, oklch(from var(--primary) calc(l * 0.35) c h));
		background: var(--light-primary);
	}
	.header-cell .filter-bar-chip-summary {
		font-size: 0.75rem;
		opacity: 0.9;
	}
	.header-cell .filter-bar-chip-summary-below {
		flex-direction: column;
		align-items: flex-start;
	}
	.header-filter-chip-icon {
		flex-shrink: 0;
		width: 1rem;
		height: 1rem;
	}
	.header-filter-string-input {
		width: 100%;
		min-width: 10rem;
		padding: 0.35rem 0.5rem;
		font-size: 0.875rem;
		border: 1px solid var(--border-color, #ccc);
		border-radius: var(--radius, 0.375rem);
	}
	@supports (top: anchor(bottom)) {
		.header-filter-popover {
			top: calc(anchor(bottom) + 6px);
			justify-self: anchor-center;
		}
	}
	.header-filter-popover {
		position: fixed;
		margin: unset;
		min-width: 12rem;
		max-width: min(90vw, 20rem);
		max-height: min(70vh, 24rem);
		overflow-y: auto;
		background: var(--background, #fff);
		border: 1px solid var(--border-color, #ddd);
		border-radius: var(--radius, 0.5rem);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 0.5rem;
		transition-property: opacity, scale;
		transition-duration: 0.2s;
		opacity: 0;
		scale: 0.98 1;
	}
	.header-filter-popover:popover-open {
		opacity: 1;
		scale: 1 1;
	}
	@starting-style {
		.header-filter-popover {
			opacity: 0;
			scale: 0.98 1;
		}
	}
	.header-filter-popover-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.header-filter-popover-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid var(--border-color, #eee);
	}
	.header-filter-popover-title {
		font-size: 0.9375rem;
		font-weight: 600;
	}
	.header-filter-clear {
		font-size: 0.8125rem;
		padding: 0.15rem 0.4rem;
		border: none;
		background: none;
		cursor: pointer;
		color: var(--primary);
	}
	.header-filter-clear:hover {
		text-decoration: underline;
	}
	.header-filter-range {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.header-filter-date-range {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.header-filter-date-label {
		display: grid;
		gap: 0.2rem;
		font-size: 0.8125rem;
	}
	.header-filter-finite-option {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
		padding: 0.35rem 0.5rem;
		border: none;
		border-radius: 0.25rem;
		background: none;
		cursor: pointer;
		font-size: 0.875rem;
		text-align: left;
	}
	.header-filter-finite-option:hover {
		background: color-mix(in srgb, currentColor 10%, transparent);
	}
</style>
