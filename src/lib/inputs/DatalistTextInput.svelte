<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InputLabel from './InputLabel.svelte';
	import TextInput, { type TextInputProps } from './TextInput.svelte';
	import type { DatalistOption } from './types';

	interface DatalistTextInputProps extends TextInputProps {
		datalist: DatalistOption[];
		value?: unknown;
		label_props?: ComponentProps<InputLabel>;
		label_element?: HTMLLabelElement;
	}
	let list: string = crypto?.randomUUID();

	let {
		datalist = $bindable(),
		value = $bindable(),
		label_element = $bindable(),
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
	{...text_input_props}
>
	<datalist id={list} tabindex="-1">
		{#each datalist as { value, label }}
			<option {value}>{label ?? value}</option>
		{/each}
	</datalist>
</TextInput>

<style>
</style>
