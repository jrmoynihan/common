<script lang="ts">
	import NumericInput from '$inputs/NumericInput.svelte';
	import Select from '$inputs/Select.svelte';
	import TemporalDateInput from '$inputs/TemporalDateInput.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import type { DatalistOption, SelectOptionList } from '$inputs/types.js';
	import { Temporal } from '@js-temporal/polyfill';

	const unicode_apple = '\u{1F34E}';
	const unicode_orange = '\u{1F34A}';
	const unicode_banana = '\u{1F34C}';
	const unicode_cherry = '\u{1F352}';
	const unicode_grapes = '\u{1F347}';
	const unicode_lemon = '\u{1F34B}';
	const unicode_pear = '\u{1F350}';
	const unicode_pineapple = '\u{1F34D}';

	let datalist: DatalistOption[] = [
		{ value: unicode_apple, label: 'Apple' },
		{ value: unicode_banana, label: 'Banana' },
		{ value: unicode_orange, label: 'Orange' },
		{ value: unicode_cherry, label: 'Cherry' },
		{ value: unicode_grapes, label: 'Grape' },
		{ value: unicode_lemon, label: 'Lemon' },
		{ value: unicode_pear, label: 'Pear' },
		{ value: unicode_pineapple, label: 'Pineapple' }
	];
	let selected_fruit: string;
	let select_options: SelectOptionList = [
		{ value: null },
		{ value: 1, disabled: true, display_text: 'One' },
		{
			label: 'Group Of Options',
			options: [
				{ value: 2, display_text: 'Two' },
				{ value: 3, display_text: 'Three' }
			]
		}
	];
</script>

<div class="inputs-container">
	<section class="text-inputs">
		<h2>Text Inputs</h2>
		<TextInput
			placeholder_props={{ placeholder: "I'm a placeholder" }}
			show_confirm={false}
			tooltip_options={{ title: `I'm a plain text input with a cancel button!` }}
		/>
		<TextInput
			bind:value={selected_fruit}
			on:confirm={(e) => {
				alert(`Selected fruit: ${e.detail}`);
			}}
			type="datalist"
			options={datalist}
			placeholder_props={{ placeholder: 'Pick a fruit' }}
			tooltip_options={{
				title: `I'm a datalist input with a cancel AND a confirmation button!`,
				position: 'bottom'
			}}
		/>
		<span class="selected-fruit">{selected_fruit}</span>
	</section>
	<section class="date-inputs">
		<h2>Date Inputs</h2>
		<TemporalDateInput
			date={Temporal.Now.zonedDateTimeISO().add({ days: 1 })}
			min={Temporal.Now.zonedDateTimeISO().subtract({ days: 7 })}
			max={Temporal.Now.zonedDateTimeISO().add({ days: 7 })}
		/>
		<TemporalDateInput
			type={'datetime-local'}
			date={Temporal.Now.zonedDateTimeISO().add({ days: 1 })}
			min={Temporal.Now.zonedDateTimeISO().subtract({ days: 7 })}
			max={Temporal.Now.zonedDateTimeISO().add({ days: 7 })}
		/>
		<TemporalDateInput
			type={'datetime'}
			min={Temporal.Now.zonedDateTimeISO().subtract({ days: 7 })}
			max={Temporal.Now.zonedDateTimeISO().add({ days: 7 })}
		/>
		<TemporalDateInput
			type={'time'}
			min={Temporal.Now.zonedDateTimeISO().subtract({ days: 7 })}
			max={Temporal.Now.zonedDateTimeISO().add({ days: 7 })}
		/>
	</section>
	<section class="numeric-inputs">
		<h2>Numeric Inputs</h2>
		<NumericInput tooltip_options={{ title: `I'm an input with custom spinner buttons!` }} />
		<NumericInput
			tooltip_options={{ title: `That's not between 0 and 10 !` }}
			max={10}
			show_spinner_buttons={false}
		/>
	</section>
	<section class="select-inputs">
		<Select
			options={select_options}
			placeholder_props={{ placeholder: 'pick one...' }}
			required={true}
		/>
	</section>
</div>

<style lang="scss">
	.inputs-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		gap: 2rem 1rem;
	}
	section {
		display: flex;
		place-items: center;
		flex-wrap: wrap;
	}
	.text-inputs,
	.date-inputs,
	.numeric-inputs {
		place-self: start;
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-self: center;
		gap: 1rem;
	}
	.selected-fruit {
		margin: 1rem;
		font-size: 2rem;
	}
</style>
