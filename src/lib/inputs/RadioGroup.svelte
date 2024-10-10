<script module lang="ts">
	import type { DynamicStyleParameters } from '$actions/dynamic-styles.svelte';

	import type { Snippet } from 'svelte';

	type InputWithLabelProps = InputProps & InputLabelProps;
	export interface RadioGroupProps<T> extends Omit<InputWithLabelProps, 'value' | 'children'> {
		/** An array or iterable of items to display in the radio group. */
		items: ArrayLike<T> | Iterable<T>;
		/** Styles to apply to the label of the selected item */
		label_dynamic_styles?: DynamicStyleParameters;
		/** Styles to apply to the input of the selected item */
		input_dynamic_styles?: DynamicStyleParameters;
		/** The key to use for the label of the selected item. (Default: 'label') */
		label_key?: string;
		/** The key to use for the value of the selected item, which affects the group's binding. (Default: the item itself, which may be an object) */
		value_key?: string;
		/** A snippet to render within the label of each item, adjacent to the radio input.*/
		children?: Snippet<[T]>;
	}
</script>

<script lang="ts" generics="T">
	import Input, { type InputProps } from './Input.svelte';

	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';

	let {
		items = $bindable([]),
		group = $bindable(),
		label_dynamic_styles = $bindable(),
		input_dynamic_styles = $bindable(),
		label_key = 'label',
		value_key,
		children,
		name = crypto.randomUUID(),
		...input_attributes
	}: RadioGroupProps<T> = $props();
</script>

{#snippet labeled_item(item)}
	{@const id = crypto.randomUUID()}
	{@const label = item instanceof Object ? item[label_key] : item}
	{@const value = value_key && item instanceof Object ? item[value_key] : item}
	<InputLabel text={label} {id}>
		<Input
			bind:group
			{id}
			{value}
			{name}
			type="radio"
			data-checked={group === item}
			{...input_attributes}
		/>
		{@render children?.(item)}
	</InputLabel>
{/snippet}

{#each items as item}
	{@render labeled_item(item)}
{/each}

<style>
	@layer input_label {
		:global(label) {
			transition: all 300ms ease;
			border-radius: var(--radio-group-border-radius, 0.25rem);
			padding: var(--radio-group-padding, 0.25rem);
		}
		:global(label:has(input[type='radio'][data-checked='true'])) {
			outline: 2px solid currentColor;
		}
	}
</style>
