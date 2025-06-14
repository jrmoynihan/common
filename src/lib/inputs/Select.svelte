<script lang="ts" module>
	// SelectOption: a single option
	export interface SelectOption<T = unknown> {
		value: T;
		label?: string;
		disabled?: boolean;
	}

	// SelectOptionGroup: a group of options
	export interface SelectOptionGroup<T = unknown> {
		label: string;
		options: Array<SelectOption<T> | SelectOptionGroup<T>>;
		disabled?: boolean;
	}

	// The options prop: array of options or groups
	export type SelectOptions<T> = Array<SelectOption<T> | SelectOptionGroup<T>>;

	export interface SelectProps<T> extends HTMLSelectAttributes {
		value?: T;
		id?: string | null;
		/** A snippet of HTML for the `<optgroup>` of the `<select>`.  This should also include logic for how to render a single `<option>` vs subgroups. */
		group_snippet?: Snippet<[SelectOptionGroup<T>]>;
		/** A snippet for how to render a single `<option>` in the `<select>`.*/
		option_snippet?: Snippet<[SelectOption<T>]>;
		options?: SelectOptions<T>;
		dynamic_select_styles?: DynamicStyleParameters;
		input_label_props?: InputLabelProps<T>;
		value_key?: string;
		label_key?: string;
		label?: Snippet<[any]>;
		children?: Snippet;
		placeholder_props?: PlaceholderProps;
	}
</script>

<script lang="ts" generics="T">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';
	import Placeholder, { type PlaceholderProps } from './Placeholder.svelte';

	let {
		value = $bindable(),
		dynamic_select_styles = $bindable(),
		options = $bindable([]),
		option_snippet = default_option,
		group_snippet = default_group,
		children,
		input_label_props,
		placeholder_props = {},
		value_key = 'value',
		label_key = 'label',
		id = crypto.randomUUID(),
		...select_attributes
	}: SelectProps<T> = $props();

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

{#snippet default_option(item: SelectOption<T>)}
	{@const { value, label, disabled } = item}
	<option {value} {disabled}>
		{label ?? value}
	</option>
{/snippet}

{#snippet default_group(group: SelectOptionGroup<T>)}
	{@const { label, options, disabled } = group}
	<optgroup {label} {disabled}>
		{#if 'options' in group}
			{#each group.options as suboption}
				{#if 'options' in suboption}
					{@render default_group(suboption)}
				{:else}
					{@render option_snippet(suboption)}
				{/if}
			{/each}
		{:else}
			{@render option_snippet(group)}
		{/if}
	</optgroup>
{/snippet}

<InputLabel {id} {...input_label_props}>
	<select
		use:dynamic_style={dynamic_select_styles}
		bind:value
		class="select"
		class:value
		{id}
		{...select_attributes}
	>
		{#if children}
			{@render children()}
		{:else}
			{#each options as opt}
				{#if 'options' in opt}
					{@render group_snippet(opt)}
				{:else}
					{@render option_snippet(opt)}
				{/if}
			{/each}
			{#each options as opt}
				{#if 'options' in opt}
					{@render group_snippet(opt)}
				{:else}
					{@render option_snippet(opt)}
				{/if}
			{/each}
		{/if}
	</select>
	<Placeholder {...placeholder_props} />
</InputLabel>

<style lang="scss">
	/* Avoid miscalculating size of padding/widths by including it in the box mesaurement */
	* {
		box-sizing: border-box;
	}
	select {
		// appearance: base-select; // New CSS if you want custom selects
		box-sizing: border-box;
		grid-area: input;
		padding: var(--text-input-padding, 1.25em);
		color: var(--text-input-color, inherit);
		width: 100%;
		margin: 0;
		border-radius: var(--text-input-border-radius, 1rem);
		border: var(--text-input-border, inset);
		min-height: 3ch;

		// Different rules that only get applied to Safari:
		background-color: var(--text-input-background, revert);

		&:focus-visible {
			outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
		}

		&:invalid:not(:focus) {
			outline: var(--input-invalid-outline, initial);
		}
	}
</style>
