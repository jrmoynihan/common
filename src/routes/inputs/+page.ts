import type { DateInputProps, SelectOptionList } from '$lib/lib_types';
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
		{ value: unicode_apple, label: 'Apple' },
		{ value: unicode_banana, label: 'Banana' },
		{ value: unicode_orange, label: 'Orange' },
		{ value: unicode_cherry, label: 'Cherry' },
		{ value: unicode_grapes, label: 'Grape' },
		{ value: unicode_lemon, label: 'Lemon' },
		{ value: unicode_pear, label: 'Pear' },
		{ value: unicode_pineapple, label: 'Pineapple' }
	];

	const select_options: SelectOptionList = [
		{ value: null },
		{ value: null, disabled: true, text: 'a disabled option' },
		{
			label: 'A Group Of Options',
			options: [
				{ value: 1, text: 'One' },
				{ value: 2, text: 'Two' },
				{ value: 3, text: 'Three' }
			]
		}
	];

	const date = Temporal.Now.zonedDateTimeISO();
	const date_inputs: DateInputProps[] = [
		{
			input_attributes: { class: 'purple' },
			date: date,
			min: date.subtract({ days: 7 }),
			max: date.add({ days: 7 }),
			label_props: {
				text: 'A standard date input with min/max dates'
			}
		},
		{
			input_attributes: { type: 'datetime-local' },
			date: date.add({ days: 1 }),
			min: date.subtract({ days: 7 }),
			max: date.add({ days: 7 }),
			label_props: {
				text: 'A datetime-local input with min/max dates'
			}
		},
		{
			input_attributes: { type: 'datetime' },
			min: date.subtract({ days: 7 }),
			max: date.add({ days: 7 }),
			label_props: {
				text: 'A datetime input with min/max dates'
			}
		},
		{
			input_attributes: { type: 'time' },
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
