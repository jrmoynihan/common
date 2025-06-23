<script module lang="ts">
	import type { DynamicStyleParameters } from '$actions/dynamic-styles.svelte';

	import type { Snippet } from 'svelte';

	type InputWithLabelProps<T> = InputProps & InputLabelProps<T>;
	export interface RadioGroupProps<T, K extends keyof T & string>
		extends Omit<InputWithLabelProps<T>, 'value' | 'children'> {
		/** An array or iterable of items to display in the radio group. */
		items: ArrayLike<T> | Iterable<T>;
		/** Attributes to pass to the label of the selected item. */
		label_attributes?: Partial<InputLabelProps<T>>;
		/** The key to use for the label of the selected item. (Default: 'label') */
		label_key?: keyof T;
		/** The key to use for the value of the selected item, which affects the group's binding. (Default: the item itself, which may be an object) */
		value_key?: K;
		/** A snippet to render within the label of each item, adjacent to the radio input.*/
		children?: Snippet<[T]>;
	}
</script>

<script lang="ts" generics="T, K extends keyof T & string">
	import Input, { type InputProps } from './Input.svelte';

	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';

	let {
		items = $bindable([]),
		group = $bindable(),
		label_attributes,
		label_key = 'label' as K,
		value_key,
		children,
		name = crypto.randomUUID(),
		...input_attributes
	}: RadioGroupProps<T, K> = $props();
</script>

{#snippet labeled_item(item: T)}
	{@const id = crypto.randomUUID()}
	{@const label = item instanceof Object && label_key in item ? item[label_key] : item}
	{@const value =
		value_key !== undefined && item instanceof Object && value_key in item ? item[value_key] : item}
	{@const is_checked =
		value_key !== undefined
			? group === value
			: group && (group as T)[label_key] === item[label_key]}
	<InputLabel
		text={typeof label === 'string' ? label : JSON.stringify(label)}
		{id}
		{...label_attributes}
	>
		<Input
			bind:group
			{id}
			{value}
			{name}
			type="radio"
			data-checked={is_checked}
			{...input_attributes}
		/>
		{@render children?.(item)}
	</InputLabel>
{/snippet}

{#each items as item}
	{@render labeled_item(item)}
{/each}

<style>
	@layer common.input.input_label {
		:global(label:has(input[type='radio'])) {
			--radiogroup-default-label-background-color: transparent;
			--radiogroup-default-label-disabled-opacity: 0.5;
			--radiogroup-default-label-checked-border-width: 2px;
			--radiogroup-default-label-hover-background-color: oklch(
				from var(--background) calc(l + 0.2) c h / 0.8
			);
			--radiogroup-default-label-transition-property: background-color, opacity;
			--radiogroup-default-label-transition-duration: 300ms;
			--radiogroup-default-label-transition-timing-function: ease;
			--radiogroup-default-label-border-radius: 1em;
			border-radius: var(
				--radiogroup-label-border-radius,
				var(--radiogroup-default-label-border-radius)
			);
			transition-property: var(
				--radiogroup-label-transition-property,
				var(--default-transition-property)
			);
			transition-duration: var(
				--radiogroup-label-transition-duration,
				var(--default-transition-duration)
			);
			transition-timing-function: var(
				--radiogroup-label-transition-timing-function,
				var(--default-transition-timing-function)
			);
			background-color: var(
				--radiogroup-label-background-color,
				var(--radiogroup-default-label-background-color)
			);
			opacity: var(--radiogroup-unchecked-opacity, var(--radiogroup-default-unchecked-opacity, 1));
			&:hover {
				background-color: var(
					--radiogroup-label-hover-background-color,
					var(--radiogroup-default-label-hover-background-color)
				);
			}
			&:disabled {
				opacity: var(
					--radiogroup-label-disabled-opacity,
					var(--radiogroup-default-label-disabled-opacity)
				);
				cursor: not-allowed;
			}
			&:focus-visible:not(:disabled) {
				outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
				background-color: var(
					--radiogroup-label-focus-background-color,
					oklch(from var(--radiogroup-default-label-hover-background-color) l c h / 1)
				);
			}
		}
		:global(label:has(input[type='radio']:checked)) {
			outline: 2px solid currentColor;
		}
		:global(input[type='radio']:focus, input[type='radio']:checked) {
			outline: none;
			box-shadow: none;
		}
	}
</style>
