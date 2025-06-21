<script module lang="ts">
	export interface DateInputProps<T> extends Omit<HTMLInputAttributes, 'date' | 'min' | 'max'> {
		date?: Temporal.ZonedDateTime;
		min?: string | number | Temporal.ZonedDateTime | null | undefined;
		max?: string | number | Temporal.ZonedDateTime | null | undefined;
		label_props?: InputLabelProps<T>;
		input_attributes?: HTMLInputAttributes;
		input_dynamic_styles?: DynamicStyleParameters;
		is_valid?: boolean;
		on_input?: () => void | Promise<void>;
		date_input?: HTMLInputElement;
		label_element?: HTMLLabelElement;
	}
</script>

<script lang="ts" generics="T">
	import { type DynamicStyleParameters } from '$actions/dynamic-styles.svelte';
	import { Temporal } from '@js-temporal/polyfill';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import InputLabel, { type InputLabelProps } from './InputLabel.svelte';
	import Input from './Input.svelte';

	// Temporal API proposal status:
	// https://tc39.es/proposal-temporal/docs/cookbook.html#current-date-and-time

	let {
		date = Temporal.Now.zonedDateTimeISO(),
		min = date.subtract({ years: 100 }),
		max = date.add({ years: 100 }),
		label_props,
		input_dynamic_styles = $bindable(),
		is_valid = $bindable(false),
		on_input,
		date_input = $bindable(),
		label_element = $bindable(),
		...input_attributes
	}: DateInputProps<T> = $props();

	const input_changed = (value: string) => {
		date = stringToTemporalDate(value);
		on_input?.();
	};
	const temporalDateToString = (
		date: Temporal.ZonedDateTime | string | number | null | undefined
	) => {
		if (!date) return '';
		if (typeof date === 'number') return new Date(date).toISOString();
		if (typeof date === 'string') return new Date(date).toISOString();
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
		const [year, month, day] = yyyy_mm_dd?.split('-') ?? [];

		switch (input_attributes?.type) {
			case 'datetime':
			case 'time':
			case 'datetime-local': {
				const hh_mm_ss = date_string.split('T')?.[1];
				const [hour, minute, second] = hh_mm_ss?.split(':') ?? [];
				const new_date_with_time = date.with({
					hour: Number.parseInt(hour ?? '0'),
					minute: Number.parseInt(minute ?? '0'),
					second: Number.parseInt(second ?? '0')
				});
				return new_date_with_time;
			}
			default: {
				const new_date = date.with({
					year: Number.parseInt(year ?? '0'),
					month: Number.parseInt(month ?? '0'),
					day: Number.parseInt(day ?? '0')
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
	<Input
		type="date"
		bind:input_dynamic_styles
		bind:value={internal_string_date}
		bind:input_element={date_input}
		id={crypto.randomUUID()}
		oninput={(e) => input_changed(e.currentTarget.value)}
		max={max_internal_string_date}
		min={min_internal_string_date}
		class={[input_attributes.required && 'required', input_attributes.class]}
		{...input_attributes}
	/>
	<!-- TODO: Add datalist option https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist#date_and_time_types -->
</InputLabel>

<style>
	@layer common.input.temporal_date_input {
		:global(label > input[type='date']) {
			border-radius: 1rem;
			padding: 0.5rem 0.75rem;
			font-family: var(--date-input-font-family, inherit);
			background-color: var(--date-input-background-color, field);
			cursor: pointer;
			grid-area: input;
			&:is(:focus-visible, :focus) {
				outline: var(--date-input-focus-outline, revert);
				box-shadow: var(--date-input-focus-box-shadow, none);
				outline-offset: var(--date-input-focus-outline-offset, 2px);
				&:required:invalid {
					outline: 2px solid var(--data-input-invalid-outline, var(--accent, revert));
				}
			}
		}
	}
</style>
