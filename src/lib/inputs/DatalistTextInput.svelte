<script module lang="ts">
	export interface DatalistTextInputProps<T> extends TextInputProps<T> {
		datalist: string[] | number[] | Record<string, unknown>[];
		value?: unknown;
		value_key?: string;
		label_key?: string;
		label_props?: ComponentProps<typeof InputLabel>;
		label_element?: HTMLLabelElement;
	}
</script>

<script lang="ts" generics="T">
	import type { ComponentProps } from 'svelte';
	import InputLabel from './InputLabel.svelte';
	import TextInput, { type TextInputProps } from './TextInput.svelte';

	let list: string = crypto?.randomUUID();

	let {
		datalist = $bindable(),
		value = $bindable(),
		label_element = $bindable(),
		value_key = 'value',
		label_key = 'label',
		label_props,
		...text_input_props
	}: DatalistTextInputProps<T> = $props();
</script>

<TextInput
	bind:value
	bind:label_element
	{label_props}
	aria-expanded={value !== ''}
	aria-controls={list}
	aria-autocomplete={'list'}
	aria-haspopup={'listbox'}
	aria-label={list}
	{list}
	type={typeof datalist[0] === 'number' ? 'number' : 'text'}
	{...text_input_props}
>
	<datalist id={list} tabindex="-1">
		{#each datalist as list_item}
			{@const is_object = typeof list_item === 'object'}
			<option value={is_object ? list_item[value_key] : list_item}>
				{#if is_object && label_key in list_item}
					{list_item[label_key]}
				{:else if is_object && value_key in list_item}
					{list_item[value_key]}
				{:else if !is_object}
					{list_item}
				{/if}
			</option>
		{/each}
	</datalist>
</TextInput>

<style>
</style>
