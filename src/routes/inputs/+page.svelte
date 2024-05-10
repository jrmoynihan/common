<script lang="ts">
	import Checkbox from '$inputs/Checkbox.svelte';
	import DatalistTextInput from '$inputs/DatalistTextInput.svelte';
	import NumericInput from '$inputs/NumericInput.svelte';
	import Select from '$inputs/Select.svelte';
	import TemporalDateInput from '$inputs/TemporalDateInput.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import type { PageData } from './$types';

	let { data } = $props();
	const { datalist, select_options, date_inputs } : PageData = data;
	let selected_fruit: string = $state('');
	let valid_email: string = $state('');
	
</script>

<div class="inputs-container">
	<section class="text-inputs">
		<h2>Text Inputs</h2>
		<TextInput
			placeholder_props={{ text: "required" }}
			show_confirm={false}
			label_props={{
				invalid_text: "Please enter text between 3-16 characters.",
				text: "Labels for Inputs",
				tooltip_props: { content: `I'm a plain text input with a cancel button!`, position: 'top'},
				valid: false
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
			{datalist} 
			bind:value={selected_fruit}
			required={true}
			onconfirm={() => alert(`Selected fruit:  ${selected_fruit}, ${datalist.find(d => d.value === selected_fruit)?.label}`)}
			placeholder_props={{text: 'Pick a fruit'}} 
			label_props={{text: "Datalist Text Input:"}}
			--input-invalid-outline="var(--accent) 2px solid"
		/>
		<span class="selected-fruit">{selected_fruit}</span>
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
		<Select
			input_label_props={{ text: "Select an option" }}
			options={select_options}
			placeholder_props={{ text: 'pick one...' }}
			required={true}
		/>
	</section>
	<section class="checkbox-inputs">
		<Checkbox>
			{#snippet label()}
				<p>Labeled Checkbox</p>
				<strong style="display: grid; place-content: center; color: var(--background); background-color: var(--accent); padding: 0.5rem">with custom html!</strong>
			{/snippet}
		</Checkbox>
		<Checkbox disabled text={"Disabled Checkbox"}/>
		<Checkbox />
	</section>
	<button class="orange">I'm a button</button>
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
