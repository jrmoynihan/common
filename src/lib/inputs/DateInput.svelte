<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.svelte';
	import { tooltip, type TooltipProps } from '$actions/tooltip/tooltip.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	// TODO: Use Temporal API instead of Date constructor
	// https://tc39.es/proposal-temporal/docs/cookbook.html#current-date-and-time
	/** The date to display */
	export let date: Date;
	export let min: Date = new Date(-8640000000000000);
	export let max: Date = new Date(8640000000000000);
	export let name: string = '';
	export let label_text: string = '';
	export let label_styles: string = '';
	export let input_styles = '';
	export let input_hover_styles = '';
	export let input_focus_styles = '';
	export let input_active_styles = '';
	export let input_container_styles = '';
	export let input_container_hover_styles = '';
	export let input_container_focus_styles = '';
	export let input_container_active_styles = '';
	export let invalid_msg: string | undefined = '';
	export let label_position: 'before' | 'after' = 'before';
	export let use_transition: boolean = false;
	export let transition = fly;
	export let transition_parameters = {
		duration: use_transition ? 500 : 0,
		x: use_transition ? 200 : 0
	};
	export let date_input: HTMLInputElement | null = null;
	export let label_element: HTMLLabelElement | null = null;
	export let is_valid: boolean | undefined = false;
	export let required: boolean = false;
	export let tooltip_options: TooltipProps | null = null;
	export let title: string = '';
	let internal: string;
	const dispatch = createEventDispatcher();
	const changed = (value: string | number) => {
		if (internal) {
			date = output(internal);
		}
		dispatch('change', value);
	};
	const convertDateToString = (date: Date) => {
		// NOTE: getMMonth is zero-based, so it requires a +1 offset to return the correct month
		const newString = `${date.getFullYear()}-${
			date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
		}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
		return newString;
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
	$: internal = convertDateToString(date);
	$: maxInternal = convertDateToString(max);
	$: minInternal = convertDateToString(min);
	$: {
		date;
		is_valid = date_input?.checkValidity();
		invalid_msg = date_input?.validationMessage;
	}
</script>

<label
	bind:this={label_element}
	for={name}
	style={label_styles}
	use:tooltip={{ ...tooltip_options }}
	use:dynamicStyle={{
		styles: input_container_styles,
		hover_styles: input_container_hover_styles,
		focus_styles: input_container_focus_styles,
		active_styles: input_container_active_styles
	}}
	title={title ? title : null}
	transition:transition={transition_parameters}
>
	{#if label_position === 'before'}
		<p>{label_text}</p>
		{#if !is_valid}
			<p class="invalid-msg">
				{invalid_msg}
			</p>
		{/if}
		<slot name="label" />
	{/if}
	<input
		use:dynamicStyle={{
			styles: input_styles,
			hover_styles: input_hover_styles,
			focus_styles: input_focus_styles,
			active_styles: input_active_styles
		}}
		bind:this={date_input}
		id={name}
		type="date"
		class="invalid"
		max={maxInternal}
		min={minInternal}
		{required}
		bind:value={internal}
		on:input={(e) => changed(e.currentTarget.value)}
	/>
	<!-- TODO: Add datalist option https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist#date_and_time_types -->
	{#if label_position === 'after'}
		{label_text}
		<slot name="label" />
	{/if}
</label>

<style lang="scss">
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
