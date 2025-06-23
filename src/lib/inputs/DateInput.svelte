<script lang="ts">
	import { dynamic_style } from '$actions/dynamic-styles.svelte';
	import { tooltip, type TooltipProps } from '$actions/tooltip/tooltip.svelte';
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	// TODO: Use Temporal API instead of Date constructor
	// https://tc39.es/proposal-temporal/docs/cookbook.html#current-date-and-time
	/** The date to display */

	interface Props {
		date: Date;
		min: Date;
		max: Date;
		name: string;
		label_text: string;
		label_styles: string;
		input_styles: string;
		input_hover_styles: string;
		input_focus_styles: string;
		input_active_styles: string;
		input_container_styles: string;
		input_container_hover_styles: string;
		input_container_focus_styles: string;
		input_container_active_styles: string;
		label_position: 'before' | 'after';
		use_transition: boolean;
		transition: SvelteTransition;
		transition_parameters: SvelteTransitionParams;
		date_input: HTMLInputElement;
		label_element: HTMLLabelElement;
		is_valid: boolean;
		invalid_msg: string;
		date_input_attributes: HTMLInputAttributes;
		tooltip_options: TooltipProps;
		label_attributes?: HTMLLabelAttributes;
		children?: Snippet;
	}
	let {
		date,
		min = new Date(-8640000000000000),
		max = new Date(8640000000000000),
		name,
		label_text,
		input_styles,
		input_hover_styles,
		input_focus_styles,
		input_active_styles,
		input_container_styles,
		input_container_hover_styles,
		input_container_focus_styles,
		input_container_active_styles,
		invalid_msg = '',
		label_position = 'before',
		use_transition = false,
		transition = fly,
		transition_parameters = { duration: use_transition ? 500 : 0, x: use_transition ? 200 : 0 },
		date_input,
		label_element,
		is_valid,
		date_input_attributes,
		tooltip_options,
		label_attributes,
		children
	}: Props = $props();

	const convertDateToString = (date: Date) => {
		// NOTE: getMMonth is zero-based, so it requires a +1 offset to return the correct month
		const newString = `${date.getFullYear()}-${
			date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
		}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
		return newString;
	};
	let internal: string = $derived(convertDateToString(date));
	const changed = (value: string | number) => {
		if (internal) {
			date = output(internal);
		}
		return value;
	};
	const output = (stringDate: string) => {
		// NOTE: remove the +1 offset to return the correct month
		const newDate = new Date(
			Number(stringDate.split('-')[0]),
			Number(stringDate.split('-')[1]) - 1,
			Number(stringDate.split('-')[2])
		);
		return newDate;
	};
	const maxInternal = $derived(convertDateToString(max));
	const minInternal = $derived(convertDateToString(min));
	$effect(() => {
		date;
		is_valid = date_input?.checkValidity();
		invalid_msg = date_input?.validationMessage;
	});
</script>

<label
	bind:this={label_element}
	for={name}
	use:tooltip={{ ...tooltip_options }}
	use:dynamic_style={{
		styles: input_container_styles,
		hover_styles: input_container_hover_styles,
		focus_styles: input_container_focus_styles,
		active_styles: input_container_active_styles
	}}
	transition:transition={transition_parameters}
	{...label_attributes}
>
	{#if label_position === 'before'}
		<p>{label_text}</p>
		{#if !is_valid}
			<p class="invalid-msg">
				{invalid_msg}
			</p>
		{/if}
		{@render children?.()}
	{/if}
	<input
		use:dynamic_style={{
			styles: input_styles,
			hover_styles: input_hover_styles,
			focus_styles: input_focus_styles,
			active_styles: input_active_styles
		}}
		bind:this={date_input}
		bind:value={internal}
		id={name}
		type="date"
		class="invalid"
		max={maxInternal}
		min={minInternal}
		oninput={(e) => changed(e.currentTarget.value)}
		onchange={(e) => changed(e.currentTarget.value)}
		{...date_input_attributes}
	/>
	<!-- TODO: Add datalist option https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist#date_and_time_types -->
	{#if label_position === 'after'}
		{label_text}
		{@render children?.()}
	{/if}
</label>

<style>
	label {
		display: grid;
		justify-items: center;
		align-items: center;
		grid-template-rows: auto 1fr;
		gap: 0.25rem;
		color: var(--dark-text);
		font-weight: 600;
	}
	input {
		border-radius: 1rem;
		padding: 0.25rem 0.5rem;
		font-size: small;
		display: flex;
		cursor: pointer;

		&::-webkit-datetime-edit {
			background-color: inherit;
			color: inherit;
		}

		&:invalid {
			border: 3px solid red;
		}
	}
	.invalid-msg {
		font-size: smaller;
		font-style: italic;
		background: var(--background);
		padding: 0.25rem 0.5rem;
		border-radius: 3vh;
	}
</style>
