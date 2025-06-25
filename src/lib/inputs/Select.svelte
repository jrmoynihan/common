<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type {
		HTMLOptgroupAttributes,
		HTMLOptionAttributes,
		HTMLSelectAttributes
	} from 'svelte/elements';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';
	import Placeholder, { type PlaceholderProps } from './Placeholder.svelte';

	export interface SelectOption<Value> extends HTMLOptionAttributes {
		value: Value;
		label: string;
	}
	export interface SelectOptionGroup<Value> extends HTMLOptgroupAttributes {
		label: string;
		options: (SelectOption<Value> | SelectOptionGroup<Value>)[];
	}
	export type StructuredOptions<Value> = (SelectOption<Value> | SelectOptionGroup<Value>)[];

	export interface SelectProps<Item, Value = Item> extends HTMLSelectAttributes {
		value?: Value;
		options?: Item[] | StructuredOptions<Value>;
		id?: string | null;
		/** A snippet for how to render a single `<option>` in the `<select>`.*/
		option_snippet?: Snippet<[Item | SelectOption<Value>]>;
		/** A snippet for how to render an `<optgroup>`. */
		group_snippet?: Snippet<[SelectOptionGroup<Value>]>;
		input_label_props?: InputLabelProps;
		value_key?: keyof Item;
		label_key?: keyof Item;
		label?: Snippet<[any]>;
		children?: Snippet;
		placeholder_props?: PlaceholderProps;
	}
</script>

<script lang="ts" generics="Item, Value = Item">
	let {
		value = $bindable(),
		options = $bindable([]),
		option_snippet = default_option_snippet,
		group_snippet = default_group_snippet,
		children,
		input_label_props,
		placeholder_props = {},
		value_key,
		label_key,
		id = crypto.randomUUID(),
		...select_attributes
	}: SelectProps<Item, Value> = $props();

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/

	function is_group(item: any): item is SelectOptionGroup<Value> {
		return item && typeof item === 'object' && 'options' in item && Array.isArray(item.options);
	}

	function get_value(item: Item): any {
		if (value_key && typeof item === 'object' && item !== null && value_key in item) {
			return item[value_key];
		}
		return item;
	}

	function get_label(item: Item): string {
		if (label_key && typeof item === 'object' && item !== null && label_key in item) {
			return String(item[label_key]);
		}
		const item_value = get_value(item);
		if (typeof item_value === 'object' && item_value !== null) {
			if ('label' in item_value) return String(item_value.label);
			if ('name' in item_value) return String(item_value.name);
			if ('id' in item_value) return String(item_value.id);
			return JSON.stringify(item_value);
		}
		return String(item_value);
	}
</script>

{#snippet default_option_snippet(option: Item | SelectOption<Value>)}
	{@const item = option as Item}
	{@const { disabled } = item as SelectOption<Value>}
	<option value={get_value(item)} {disabled}>
		{get_label(item)}
	</option>
{/snippet}

{#snippet default_group_snippet(group: SelectOptionGroup<Value>)}
	<optgroup label={group.label} disabled={group.disabled}>
		{#each group.options as item}
			{#if is_group(item)}
				{@render group_snippet(item)}
			{:else}
				{@render option_snippet(item)}
			{/if}
		{/each}
	</optgroup>
{/snippet}

<InputLabel {id} {...input_label_props}>
	<select bind:value class="select" class:value {id} {...select_attributes}>
		{#if children}
			{@render children()}
		{:else}
			{#each options as item}
				{#if is_group(item)}
					{@render group_snippet(item)}
				{:else}
					{@render option_snippet(item)}
				{/if}
			{/each}
		{/if}
	</select>
	<Placeholder {...placeholder_props} />
</InputLabel>

<style>
	* {
		/* Avoid miscalculating size of padding/widths by including it in the box mesaurement */
		box-sizing: border-box;
	}
	select {
		/* appearance: base-select;  /* New CSS if you want custom selects */
		box-sizing: border-box;
		grid-area: input;
		padding: var(--text-input-padding, 1.25em);
		color: var(--text-input-color, inherit);
		width: 100%;
		margin: 0;
		border-radius: var(--text-input-border-radius, 1rem);
		border: var(--text-input-border, inset);
		min-height: 3ch;

		/* Different rules that only get applied to Safari: */
		background-color: var(--text-input-background, revert);

		&:focus-visible {
			outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
		}

		&:invalid:not(:focus) {
			outline: var(--input-invalid-outline, initial);
		}
	}
</style>
