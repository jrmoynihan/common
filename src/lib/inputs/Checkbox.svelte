<script module lang="ts">
	export interface CheckboxProps extends HTMLInputAttributes {
		/** The label snippet for the checkbox. */
		label?: string | Snippet;
		/** The attributes to apply to the label. */
		label_attributes?: HTMLLabelAttributes;
		/** Whether the checkbox is disabled. */
		disabled?: boolean;
		/** The id of the checkbox.  Ids the `<input>` element and provides the `for` attribute of the label. */
		id?: string;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';

	let {
		label,
		disabled,
		id = crypto?.randomUUID(),
		label_attributes,
		...input_attributes
	}: CheckboxProps = $props();
</script>

<label for={id} {...label_attributes}>
	{#if typeof label === 'string'}
		{label}
	{:else if label}
		{@render label()}
	{/if}
	<input {id} type="checkbox" {disabled} {...input_attributes} />
</label>

<style lang="scss">
	label {
		--checkbox-default-transition-speed: 150ms;
		--checkbox-default-transition-timing-function: ease;
		--checkbox-default-label-display: inline-flex;
		--checkbox-default-label-background-color: transparent;
		--checkbox-default-accent-color: oklch(0.55 0.23 146.07);
		--checkbox-default-transition-function: var(
				--checkbox-transition-speed,
				var(--checkbox-default-transition-speed)
			)
			var(--checkbox-transition-timing-function, var(--checkbox-default-transition-timing-function));
		--checkbox-default-checked-transition: scale var(--checkbox-default-transition-function),
			opacity var(--checkbox-default-transition-function);
		--checbox-default-label-transition: background-color var(--checkbox-default-transition-function);
		--checkbox-default-unchecked-opacity: 0.5;
		--checkbox-default-checked-opacity: 1;
		--checkbox-default-checked-scale: 1.3;
		--checkbox-default-padding: 0.5rem;
		--checkbox-default-label-padding: 0.5rem;
		--checkbox-default-label-border-radius: 0.5rem;
		--checkbox-default-label-gap: 0.5rem;
		--checkbox-default-label-hover-background-color: oklch(
			from var(--background) calc(l + 0.2) c h
		);
		--checkbox-default-label-disabled-opacity: 0.5;
		--checkbox-default-font-size: initial;
		--checkbox-default-user-select: none;
		cursor: pointer;
		display: var(--checkbox-label-display, var(--checkbox-default-label-display));
		transition: var(--checkbox-label-transition, var(--checbox-default-label-transition));
		padding: var(--checkbox-label-padding, var(--checkbox-default-label-padding));
		border-radius: var(--checkbox-label-border-radius, var(--checkbox-default-label-border-radius));
		gap: var(--checkbox-label-gap, var(--checkbox-default-label-gap));
		font-size: var(--checkbox-font-size, var(--checkbox-default-font-size));
		background-color: var(
			--checkbox-label-background-color,
			var(--checkbox-default-label-background-color)
		);
		user-select: var(--checkbox-user-select, var(--checkbox-default-user-select));
		&:hover {
			background-color: var(
				--checkbox-label-hover-background-color,
				var(--checkbox-default-label-hover-background-color)
			);
		}
		&:has(> input[type='checkbox']:disabled) {
			opacity: var(
				--checkbox-label-disabled-opacity,
				var(--checkbox-default-label-disabled-opacity)
			);
			cursor: not-allowed;
		}
		& > input[type='checkbox'] {
			accent-color: var(--checkbox-accent-color, var(--checkbox-default-accent-color));
			opacity: var(--checkbox-unchecked-opacity, var(--checkbox-default-unchecked-opacity));
			padding: var(--checkbox-padding, var(--checkbox-default-padding));
			&:checked {
				opacity: var(--checkbox-checked-opacity, var(--checkbox-default-checked-opacity));
				scale: var(--checkbox-checked-scale, var(--checkbox-default-checked-scale));
				transition: var(--checkbox-checked-transition, var(--checkbox-default-checked-transition));
			}
			&:disabled {
				cursor: not-allowed;
			}
		}
	}
</style>
