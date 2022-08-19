<script lang="ts">
	import { tooltip, type TooltipDirections } from '$lib/tooltip';

	import { Temporal } from '@js-temporal/polyfill';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	// TODO: Use Temporal API instead of Date constructor
	// https://tc39.es/proposal-temporal/docs/cookbook.html#current-date-and-time
	/** The date to display */
	export let date: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO();
	export let type: 'date' | 'datetime' | 'datetime-local' | 'time' = 'date';
	export let min: Temporal.ZonedDateTime = date.subtract({ years: 100 });
	export let max: Temporal.ZonedDateTime = date.add({ years: 100 });
	export let name: string = '';
	export let label_text: string = '';
	export let label_styles: string = '';
	export let input_styles: string = '';
	export let invalid_msg: string | null | undefined = null;
	export let invalid_msg_position: TooltipDirections = 'top';
	export let invalid_tooltip_css: [string, string][] = [
		['font-size', 'smaller'],
		['color', 'var(--date-input-invalid-message-color, salmon)'],
		['background', 'var(--date-input-invalid-message-background, white)'],
		['padding', '0.5rem'],
		['border-radius', '1rem']
	];
	export let label_position: 'before' | 'after' = 'before';
	export let use_transition: boolean = false;
	export let transition = fly;
	export let transition_params = {
		duration: use_transition ? 500 : 0,
		x: use_transition ? 200 : 0
	};
	export let dateInput: HTMLInputElement | null = null;
	export let is_valid: boolean | undefined = false;
	export let required: boolean = false;
	const dispatch = createEventDispatcher();

	const changed = (value: string | number) => {
		if (internal_string_date) {
			date = stringToTemporalDate(internal_string_date);
		}
		dispatch('change', { value, date });
	};
	const temporalDateToString = (date: Temporal.ZonedDateTime) => {
		const { year, month, day, hour, minute, second } = date;
		const date_string = `${year}-${month < 10 ? `0${month}` : month}-${day}`;
		const time_string = `T${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${
			second < 10 ? `0${second}` : second
		}`;
		switch (type) {
			case 'date':
				return date_string;
			case 'datetime':
				return `${date_string}${time_string}`;
			case 'datetime-local':
				return `${date_string}${time_string}`;
			case 'time':
				return time_string;
			default:
				return date_string;
		}
	};
	const stringToTemporalDate = (date_string: string) => {
		const yyyy_mm_dd = date_string.split('T')[0];
		const [year, month, day] = yyyy_mm_dd?.split('-');

		const new_date = date.with({
			year: parseInt(year),
			month: parseInt(month),
			day: parseInt(day)
		});
		switch (type) {
			case 'date':
				return new_date;
			default:
				const hh_mm_ss = date_string.split('T')[1];
				const [hour, minute, second] = hh_mm_ss?.split(':');
				const new_date_with_time = new_date.with({
					hour: parseInt(hour),
					minute: parseInt(minute),
					second: parseInt(second)
				});
				return new_date_with_time;
		}
	};
	let internal_string_date: string = temporalDateToString(date);
	let max_internal: string = temporalDateToString(max);
	let min_internal: string = temporalDateToString(min);

	$: internal_string_date = temporalDateToString(date);
	$: max_internal = temporalDateToString(max);
	$: min_internal = temporalDateToString(min);
	$: {
		date;
		is_valid = dateInput?.checkValidity() ?? true;
		invalid_msg = invalid_msg ? invalid_msg : dateInput?.validationMessage;
	}
	// $: console.log('internal', internal_string_date);
	// $: console.log('date', date);
</script>

<label
	for={name}
	style={label_styles}
	transition:transition={transition_params}
	use:tooltip={{
		position: invalid_msg_position,
		title: `${invalid_msg}`,
		visible: !is_valid,
		disabled: is_valid || !invalid_msg,
		css: invalid_tooltip_css
	}}
>
	{#if label_position === 'before'}
		{label_text}
		<slot name="label-text" />
	{/if}
	<!-- NOTE: Can't use dynamic {type} with bind:value, so instead we'll conditionally create different types of date inputs -->
	{#if type === 'date'}
		<input
			bind:this={dateInput}
			id={name}
			type="date"
			class="invalid"
			style={input_styles}
			max={max_internal}
			min={min_internal}
			{required}
			bind:value={internal_string_date}
			on:input={(e) => changed(e.currentTarget.value)}
		/>
	{:else if type === 'datetime'}
		<input
			bind:this={dateInput}
			id={name}
			type="datetime"
			class="invalid"
			style={input_styles}
			max={max_internal}
			min={min_internal}
			{required}
			bind:value={internal_string_date}
			on:input={(e) => changed(e.currentTarget.value)}
		/>
	{:else if type === 'datetime-local'}
		<input
			bind:this={dateInput}
			id={name}
			type="datetime-local"
			class="invalid"
			style={input_styles}
			max={max_internal}
			min={min_internal}
			{required}
			bind:value={internal_string_date}
			on:input={(e) => changed(e.currentTarget.value)}
		/>
	{:else if type === 'time'}
		<input
			bind:this={dateInput}
			id={name}
			type="time"
			class="invalid"
			style={input_styles}
			max={max_internal}
			min={min_internal}
			{required}
			bind:value={internal_string_date}
			on:input={(e) => changed(e.currentTarget.value)}
		/>
	{/if}
	{#if label_position === 'after'}
		{label_text}
		<slot name="label-text" />
	{/if}
</label>

<style lang="scss">
	label {
		display: grid;
		justify-items: center;
		align-items: center;
		grid-template-rows: auto 1fr;
		gap: 0.25rem;
		color: var(--date-input-label-color, inherit);
		font-weight: 600;
	}
	input {
		border-radius: 1rem;
		padding: 0.5rem 0.75rem;
		font-family: var(--date-input-font-family, inherit);
		display: flex;
		cursor: pointer;

		&:invalid {
			border: var(--date-input-invalid-border, 3px solid salmon);
		}
	}
</style>
