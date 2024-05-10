<script context="module" lang="ts">
	export interface DateInputProps extends Omit<HTMLInputAttributes, 'date' | 'min' | 'max'> {
		date?: Temporal.ZonedDateTime;
		min?: Temporal.ZonedDateTime;
		max?: Temporal.ZonedDateTime;
		label_props?: InputLabelProps;
		input_attributes?: HTMLInputAttributes;
		input_dynamic_styles?: DynamicStyleParameters;
		is_valid?: boolean;
		on_input?: () => void | Promise<void>;
		date_input?: HTMLInputElement;
		label_element?: HTMLLabelElement;
	}
</script>

<script lang="ts">
	import { dynamicStyle, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte';
	import { Temporal } from '@js-temporal/polyfill';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';

	// Temporal API proposal status:
	// https://tc39.es/proposal-temporal/docs/cookbook.html#current-date-and-time

	let {
		date = Temporal.Now.zonedDateTimeISO(),
		min = date.subtract({ years: 100 }),
		max = date.add({ years: 100 }),
		label_props,
		input_dynamic_styles,
		is_valid = $bindable(false),
		on_input,
		date_input = $bindable(),
		label_element = $bindable(),
		...input_attributes
	}: DateInputProps = $props();

	const input_changed = (value: string) => {
		date = stringToTemporalDate(value);
		on_input?.();
	};
	const temporalDateToString = (date: Temporal.ZonedDateTime) => {
		const { year, month, day, hour, minute, second } = date;
		const date_string = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
		const time_string = `T${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${
			second < 10 ? `0${second}` : second
		}`;
		switch (input_attributes?.type) {
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
		const [year, month, day] = yyyy_mm_dd.split('-');

		switch (input_attributes?.type) {
			case 'datetime' || 'time' || 'datetime-local': {
				const hh_mm_ss = date_string.split('T')?.[1];
				const [hour, minute, second] = hh_mm_ss.split(':');
				const new_date_with_time = date.with({
					hour: Number.parseInt(hour),
					minute: Number.parseInt(minute),
					second: Number.parseInt(second)
				});
				return new_date_with_time;
			}
			default: {
				const new_date = date.with({
					year: Number.parseInt(year),
					month: Number.parseInt(month),
					day: Number.parseInt(day)
				});
				return new_date;
			}
		}
	};

	let internal_string_date = $state(temporalDateToString(date));
	const max_internal_string_date = $derived(temporalDateToString(max));
	const min_internal_string_date = $derived(temporalDateToString(min));

	$effect(() => {
		internal_string_date;
		if (date_input) {
			is_valid = date_input.checkValidity();
			if (label_props) {
				label_props.invalid_text = date_input.validationMessage;
			}
		}
	});
	$effect(() => {
		date = stringToTemporalDate(internal_string_date);
	});
</script>

<InputLabel bind:label_element {...label_props}>
	<input
		use:dynamicStyle={input_dynamic_styles}
		bind:this={date_input}
		bind:value={internal_string_date}
		id={crypto.randomUUID()}
		type="date"
		oninput={(e) => input_changed(e.currentTarget.value)}
		{...input_attributes}
		max={max_internal_string_date}
		min={min_internal_string_date}
	/>
	<!-- TODO: Add datalist option https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist#date_and_time_types -->
</InputLabel>

<style lang="scss">
	@layer temporal_date_input {
		input {
			border-radius: 1rem;
			padding: 0.5rem 0.75rem;
			font-family: var(--date-input-font-family, inherit);
			cursor: pointer;
			grid-area: input;

			&:invalid {
				border: var(--date-input-invalid-border, 3px solid salmon);
			}
		}
	}
</style>
