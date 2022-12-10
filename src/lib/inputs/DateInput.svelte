<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	// TODO: Use Temporal API instead of Date constructor
	// https://tc39.es/proposal-temporal/docs/cookbook.html#current-date-and-time
	/** The date to display */
	export let date: Date;
	export let min: Date = new Date(-8640000000000000);
	export let max: Date = new Date(8640000000000000);
	export let name: string = '';
	export let labelText: string = '';
	export let labelStyles: string = '';
	export let inputStyles: string = '';
	export let invalidMsg: string | undefined = '';
	export let labelPosition: 'before' | 'after' = 'before';
	export let useTransition: boolean = false;
	export let transition = fly;
	export let transitionParams = { duration: useTransition ? 500 : 0, x: useTransition ? 200 : 0 };
	export let dateInput: HTMLInputElement | null = null;
	export let labelElement: HTMLLabelElement | null = null;
	export let isValid: boolean | undefined = false;
	export let required: boolean = false;
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
		isValid = dateInput?.checkValidity();
		invalidMsg = dateInput?.validationMessage;
	}
</script>

<label
	bind:this={labelElement}
	for={name}
	style={labelStyles}
	transition:transition={transitionParams}
>
	{#if labelPosition === 'before'}
		<p>{labelText}</p>
		{#if !isValid}
			<p class="invalid-msg">
				{invalidMsg}
			</p>
		{/if}
		<slot name="label" />
	{/if}
	<input
		bind:this={dateInput}
		id={name}
		type="date"
		class="invalid"
		style={inputStyles}
		max={maxInternal}
		min={minInternal}
		{required}
		bind:value={internal}
		on:input={(e) => changed(e.currentTarget.value)}
	/>
	<!-- TODO: Add datalist option https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist#date_and_time_types -->
	{#if labelPosition === 'after'}
		{labelText}
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
