import type { DateInputProps } from '$inputs/TemporalDateInput.svelte';
import { Temporal } from '@js-temporal/polyfill';
import type { PageLoadEvent } from './$types';

export async function load({}: PageLoadEvent) {
	const unicode_apple = '\u{1F34E}';
	const unicode_orange = '\u{1F34A}';
	const unicode_banana = '\u{1F34C}';
	const unicode_cherry = '\u{1F352}';
	const unicode_grapes = '\u{1F347}';
	const unicode_lemon = '\u{1F34B}';
	const unicode_pear = '\u{1F350}';
	const unicode_pineapple = '\u{1F34D}';

	const datalist = [
		{ icon: unicode_apple, label: 'Apple' },
		{ icon: unicode_banana, label: 'Banana' },
		{ icon: unicode_orange, label: 'Orange' },
		{ icon: unicode_cherry, label: 'Cherry' },
		{ icon: unicode_grapes, label: 'Grape' },
		{ icon: unicode_lemon, label: 'Lemon' },
		{ icon: unicode_pear, label: 'Pear' },
		{ icon: unicode_pineapple, label: 'Pineapple' }
	];

	interface SelectOption {
		value?: number;
		label?: string;
		disabled?: boolean;
		options?: SelectOption[];
	}

	const select_options: SelectOption[] = [
		{ value: 0, label: 'Basic Option' },
		{ value: 0.5, disabled: true, label: 'a disabled option' },
		{
			label: 'A Group Of Options',
			options: [
				{ value: 1, label: 'One' },
				{ value: 2, label: 'Two' },
				{ value: 3, label: 'Three' }
			]
		}
	];

	const date = Temporal.Now.zonedDateTimeISO();
	const date_inputs: DateInputProps<{
		date: Temporal.ZonedDateTime;
		min: Temporal.ZonedDateTime;
		max: Temporal.ZonedDateTime;
		label_props: {
			text: string;
		};
	}>[] = [
		{
			class: 'purple',
			date: date,
			min: date.subtract({ days: 7 }),
			max: date.add({ days: 7 }),
			label_props: {
				text: 'A standard date input with min/max dates'
			}
		},
		{
			type: 'datetime-local',
			date: date.add({ days: 1 }),
			min: date.subtract({ days: 7 }),
			max: date.add({ days: 7 }),
			label_props: {
				text: 'A datetime-local input with min/max dates'
			}
		},
		{
			type: 'datetime',
			min: date.subtract({ days: 7 }),
			max: date.add({ days: 7 }),
			label_props: {
				text: 'A datetime input with min/max dates'
			}
		},
		{
			type: 'time',
			min: date.subtract({ hours: 12 }),
			max: date.add({ hours: 12 }),
			label_props: {
				text: 'A time input with min/max times'
			}
		}
	];

	return {
		datalist,
		select_options,
		date_inputs
	};
}
