<script context="module" lang="ts">
	export interface JSONViewProps<T> {
		/**  object or array to display */
		obj: Object | Array<T>;
		/** initial expansion depth */
		depth?: number;
		/** separator character between keys and values */
		key_value_separator?: string;
		/** separator character between items */
		item_separator?: string;
		/** attributes to apply to the `<ul>` element */
		ul_attributes?: HTMLAttributes<HTMLUListElement>;
		/** attributes to apply to the `<li>` element */
		li_attributes?: HTMLLiAttributes;
		/** attributes to apply to the `<a>` element for links */
		link_attributes?: HTMLAnchorAttributes;
		/** attributes to apply to the `<span>` element for keys */
		key_span_attributes?: HTMLAttributes<HTMLSpanElement>;
		/** attributes to apply to the `<span>` element for values */
		value_span_attributes?: HTMLAttributes<HTMLSpanElement>;
		/** attributes to apply to the `<button>` element for brackets */
		bracket_button_attributes?: HTMLButtonAttributes;
		_current_depth?: number;
		_is_last_item_or_key?: boolean;
	}
</script>

<script lang="ts" generics="T">
	import type {
		HTMLAnchorAttributes,
		HTMLAttributes,
		HTMLButtonAttributes,
		HTMLLiAttributes
	} from 'svelte/elements';

	let {
		obj,
		depth = 1,
		key_value_separator = ': ',
		item_separator = '',
		ul_attributes,
		li_attributes,
		link_attributes,
		key_span_attributes,
		value_span_attributes,
		bracket_button_attributes,
		_current_depth = 0,
		_is_last_item_or_key = false
	}: JSONViewProps<T> = $props();

	const keys = $derived(getType(obj) === 'object' ? Object.keys(obj) : []);
	const is_array = $derived(Array.isArray(obj));
	const brackets = $derived(is_array ? ['[', ']'] : ['{', '}']);
	let collapsed = $state(depth < _current_depth);

	/** Get the type of an item */
	function getType(item: unknown) {
		if (item === null) return 'null';
		return typeof item;
	}

	/** Format an item */
	function format(item: unknown) {
		switch (getType(item)) {
			case 'function':
				return 'f () {...}';
			case 'symbol':
				const i = item as symbol;
				return i.toString();
			default:
				return JSON.stringify(item);
		}
	}

	function clicked() {
		collapsed = !collapsed;
	}

	/** Press enter or space to expand/collapse */
	function pressed(e: Event) {
		if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)) {
			clicked();
		}
	}

	function is_valid_URL(str: string) {
		try {
			if (!str) return false;
			new URL(str);
			return true;
		} catch (error) {
			return false;
		}
	}
</script>

{#snippet bracket(position: 'start' | 'end' | 'both', empty : boolean, collapsed: boolean)}
	<button
		class="_jsonBkt"
		class:empty
		class:is_array
		tabindex="0"
		onclick={clicked}
		onkeydown={pressed}
		disabled={empty}
		{...bracket_button_attributes}
	>
		{#if position === 'start' || position === 'both'}
			{brackets[0]}
		{/if}
		{#if collapsed}
			{keys.length} {is_array ? ' items' : ' keys'}
		{/if}
		{#if position === 'end' || position === 'both'}
			{brackets[1]}
		{/if}
	</button>
{/snippet}

{#snippet separator(sep: string)}
	<span class="_jsonSep">
		{sep}
	</span>
{/snippet}

{#snippet formatted_value(value)}
	{#if is_valid_URL(value)}
		<a href={value} rel="noopener noreferrer" target="_blank" {...link_attributes}>{value}</a>
	{:else}
		{format(value)}
	{/if}
{/snippet}

<!-- JSON --->
{#if !keys.length}
	{@render bracket('both', true, false)}

	{#if !_is_last_item_or_key}
		{@render separator(item_separator)}
	{/if}
{:else if collapsed}
	{@render bracket('both', false, true)}

	{#if !_is_last_item_or_key && collapsed}
		{@render separator(item_separator)}
	{/if}
{:else}
	{@render bracket('start', false, false)}
	<ul class="_jsonList" {...ul_attributes}>
		{#each keys as key, index}
			<!-- Make TS happy about string index lookups on the object-->
			{@const record = obj as Record<string, unknown>}
			{#if key in record}
				{@const value = record[key]}
				{@const type = getType(value)}
				<li class="_jsonListItem" {...li_attributes}>
					{#if !is_array}
						<span class="_jsonKey" {...key_span_attributes}>
							{JSON.stringify(key)}
						</span>
						{@render separator(key_value_separator)}
					{/if}

					{#if type === 'object'}
						<svelte:self
							obj={value}
							{depth}
							_current_depth={_current_depth + 1}
							_is_last_item_or_key={index === keys.length - 1}
						/>
					{:else}
						<span class="_jsonVal {type}" {...value_span_attributes}>
							{@render formatted_value(value)}
						</span>

						{#if index < keys.length - 1}
							{@render separator(item_separator)}
						{/if}
					{/if}
				</li>
			{/if}
		{/each}
	</ul>

	{@render bracket('end', false, false)}

	{#if !_is_last_item_or_key}
		{@render separator(item_separator)}
	{/if}
{/if}

<style>
	:where(._jsonList) {
		list-style: none;
		margin: 0;
		padding: 0;
		padding-left: var(--jsonPaddingLeft, 1rem);
		border-left: var(--jsonBorderLeft, 1px dotted);
	}
	:where(._jsonListItem) {
		text-align: justify;
	}
	:where(._jsonBkt) {
		appearance: none;
		background-color: unset;
		border: unset;
		color: var(--jsonBracketColor, currentcolor);
		width: var(--json-width, max-content);
	}
	:where(._jsonBkt):not(.empty):hover {
		cursor: pointer;
		background-color: var(--jsonBracketHoverBackground, #aaad);
	}
	:where(._jsonSep) {
		color: var(--jsonSeparatorColor, currentcolor);
	}
	:where(._jsonKey) {
		color: var(--jsonKeyColor, currentcolor);
	}
	:where(._jsonVal) {
		color: var(--jsonValColor, #9ca3af);
	}
	:where(._jsonVal).string {
		color: var(--jsonValStringColor, #059669);
	}
	:where(._jsonVal).number {
		color: var(--jsonValNumberColor, #d97706);
	}
	:where(._jsonVal).boolean {
		color: var(--jsonValBooleanColor, #2563eb);
	}
</style>
