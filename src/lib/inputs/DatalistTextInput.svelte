<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import TextInput from './TextInput.svelte';
	import type { DatalistOption } from './types';

	interface DatalistTextInputProps {
		datalist: DatalistOption[];
		text_input_props?: Omit<
			ComponentProps<TextInput>,
			'value' | 'invalid_msg' | 'invalid_msg_visible' | 'label_element'
		>;
		value?: unknown;
		label_props?: ComponentProps<InputLabel>;
		label_element?: HTMLLabelElement;
	}

	let {
		text_input_props = $bindable(),
		datalist = $bindable(),
		value = $bindable(),
		label_props,
		label_element = $bindable()
	}: DatalistTextInputProps = $props();

	let list: string = crypto?.randomUUID();

	let text_input_p: HTMLInputAttributes = {
		...text_input_props?.input_attributes,
		list,
		'aria-expanded': text_input_props?.input_attributes?.value !== '',
		'aria-controls': list,
		'aria-autocomplete': 'list',
		'aria-haspopup': 'listbox',
		'aria-label': list
	};
</script>

<TextInput
	{...text_input_props}
	{label_props}
	input_attributes={text_input_p}
	bind:value
	bind:label_element
>
	<datalist id={list} tabindex="-1">
		{#each datalist as { value, label }}
			<option {value}>{label}</option>
		{/each}
	</datalist>
</TextInput>

<style>
</style>
