<script lang="ts">
	import { setDerivedContext } from '$functions/store.svelte';
	import Checkbox from '$inputs/Checkbox.svelte';
	import DatalistTextInput from '$inputs/DatalistTextInput.svelte';
	import NumericInput from '$inputs/NumericInput.svelte';
	import RadioGroup from '$inputs/RadioGroup.svelte';
	import Select from '$inputs/Select.svelte';
	import TemporalDateInput from '$inputs/TemporalDateInput.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import type { PageData } from './$types';

	let { data } = $props();
	const { datalist, select_options, date_inputs } : PageData = data;
	const name_list = datalist.map(d => d.label);
	let selected_fruit: typeof datalist[0] | undefined = $state();
	let selected_fruit_name: string | undefined = $state();
	let selected_number = $state<number>(1);
	let valid_email: string = $state('');

	const number_options = [ 1, 2, 3]
	const double_number_context = setDerivedContext('number', selected_number * 2);

</script>

<div class="inputs-container">
	<section class="text-inputs">
		<h2>Text Inputs</h2>
		<TextInput
			placeholder_props={{ text: "required", dynamic_styles: {
				invalid_styles: 'color: var(--text);',
				valid_styles: 'color: var(--text);'
			} }}
			show_confirm={false}
			label_props={{
				invalid_text: "Please enter text between 3-16 characters.",
				text: "Labels for Inputs",
				tooltip_props: { content: `I'm a plain text input with a cancel button!`, position: 'top'},
			}}
			dynamic_input_styles={{
				invalid_styles: 'background: oklch(70% 0.1 30 / 0.4);',
				valid_styles: 'background: oklch(70% 0.1 130 / 0.3);'
			}}
			autocomplete='off'
			required={true}
			pattern={"[a-z]{3,16}"}
			--input-invalid-outline="var(--accent) 2px solid"
			/>
		<TextInput
			bind:value={valid_email}
			placeholder_props={{ text: 'john@example.com' }}
			label_props={{
				invalid_text: "Invalid email address.",
				text: "Email address:",
				tooltip_props: { content: `I'm an email input that hides the confirm button when the email is invalid!`}
			}}
			type='email'
			autocomplete='email'
			required={true}
			onconfirm={() => {
				alert(`Email confirmed!  ${valid_email}`);
			}}
			--input-invalid-outline="var(--accent) 2px solid"
		/>

		<DatalistTextInput 
			datalist={datalist}
			value_key={'icon'}
			bind:value={selected_fruit_name}
			required={true}
			onconfirm={() => alert(`Selected fruit:  ${selected_fruit_name}`)}
			placeholder_props={{text: 'Pick a fruit'}} 
			label_props={{text: "Datalist Text Input:", invalid_text: "Please enter a valid fruit."}}
			--input-invalid-outline="var(--accent) 2px solid"
		/>
	</section>
	<section class="date-inputs">
		<h2>Date Inputs</h2>
		{#each date_inputs as input}
			<TemporalDateInput {...input} />
		{/each}
	</section>
	<section class="numeric-inputs">
		<h2>Numeric Inputs</h2>
		<NumericInput placeholder={'a placeholder that disappears'} />
		<NumericInput
			min={0}
			max={10}
			tooltip_options={{ content: `Is it between 0 and 10?` }}
			show_spinner_buttons={false}
		/>
	</section>
	<section class="select-inputs">
		<h2>Select Inputs</h2>
		<Select
			input_label_props={{ text: "Select an option" }}
			options={select_options}
			placeholder_props={{ text: 'pick one...' }}
			required={true}
		/>
		<Select
			input_label_props={{ text: "Select an option" }}
			options={number_options}
			placeholder_props={{ text: 'pick one...' }}
			required={true}
			bind:value={selected_number}
		/>
		<Select
			input_label_props={{ text: "Select a fruit" }}
			options={datalist}
			placeholder_props={{ text: 'pick a fruit...' }}
			bind:value={selected_fruit}
		/>
	</section>

	<section class="checkbox-inputs">
		<h2>Checkbox Inputs</h2>
		<Checkbox>
			{#snippet label()}
				<p>Labeled Checkbox</p>
				<strong style="display: grid; place-content: center; color: var(--background); background-color: var(--accent); padding: 0.5rem">with custom html!</strong>
			{/snippet}
		</Checkbox>
		<Checkbox disabled label={"Disabled Checkbox"}/>
		<Checkbox />
	</section>
	<section class="radio-inputs">
		<h2>Radio Inputs</h2>
		<RadioGroup items={datalist} bind:group={selected_fruit}>
			{#snippet children(item)}
				<span class="selected-fruit">{item?.icon}</span>
			{/snippet}
		</RadioGroup>
		<RadioGroup items={number_options} bind:group={selected_number}/>
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
		flex-wrap: wrap;
		flex-basis: min(100rem, 50vw);
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
	.radio-inputs{
		display: flex;
		gap: 1rem;
	}
	.date-inputs{
		@layer input_label {
			:global(label) {
				max-width: 14em;
			}
		}
	}
	.selected-fruit {
		margin: 1rem;
		font-size: 2rem;
	}
</style>
