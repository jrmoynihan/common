<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InputLabel from './InputLabel.svelte';
	import TextInput, { type TextInputProps } from './TextInput.svelte';
	// import type { DatalistOption } from './types';

	export interface DatalistTextInputProps extends TextInputProps {
		datalist: string[] | number[] | Record<string, unknown>[];
		value?: unknown;
		value_key?: string;
		label_key?: string;
		label_props?: ComponentProps<InputLabel>;
		label_element?: HTMLLabelElement;
	}
	let list: string = crypto?.randomUUID();

	let {
		datalist = $bindable(),
		value = $bindable(),
		label_element = $bindable(),
		value_key = 'value',
		label_key = 'label',
		label_props,
		...text_input_props
	}: DatalistTextInputProps = $props();
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
