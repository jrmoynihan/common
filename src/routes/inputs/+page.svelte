<script lang="ts">
	import TextInput from '$lib/inputs/TextInput.svelte';
	import type { DatalistOption } from '$lib/inputs';
	import { Temporal } from '@js-temporal/polyfill';
	import TemporalDateInput from '$lib/inputs/TemporalDateInput.svelte';

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
</script>

<section class="text-inputs">
	<p>
		<TextInput
			placeholder="I'm a placeholder"
			show_confirm={false}
			tooltip_options={{ title: 'Nothing special here.' }}
		/>
	</p>
	<p>
		<TextInput
			bind:value={selected_fruit}
			type="datalist"
			options={datalist}
			placeholder="Pick a fruit"
		/>
		<span class="selected-fruit">{selected_fruit}</span>
	</p>
</section>
<section class="date-inputs">
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
</section>

<style lang="scss">
	section {
		display: flex;
		place-items: center;
	}
	.text-inputs {
		place-self: start;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
		gap: 1rem;
	}
	p {
		display: grid;
	}
	.selected-fruit {
		margin: 1rem;
		font-size: 2rem;
	}
</style>
