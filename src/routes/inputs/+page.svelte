<script lang="ts">
	import { Inspect } from 'svelte-inspect-value';
	import Checkbox from '$inputs/Checkbox.svelte';
	import DatalistTextInput from '$inputs/DatalistTextInput.svelte';
	import NumericInput from '$inputs/NumericInput.svelte';
	import RadioGroup from '$inputs/RadioGroup.svelte';
	import Select from '$inputs/Select.svelte';
	import TemporalDateInput from '$inputs/TemporalDateInput.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	const { datalist, select_options, date_inputs }: PageData = data;
	const name_list = datalist.map((d) => d.label);
	let selected_fruit: (typeof datalist)[0] | undefined = $state();
	let selected_option: (typeof select_options)[0] | undefined = $state();
	let selected_fruit_name: string | undefined = $state();
	let selected_number = $state<number>(1);
	let valid_email: string = $state('');
	let value_key: keyof (typeof select_options)[0] = $state(
		'value' as keyof (typeof select_options)[0]
	);
	let label_key: keyof (typeof select_options)[0] = $state(
		'label' as keyof (typeof select_options)[0]
	);
	let option_keys = $derived(
		Array.from(new Set(select_options.flatMap((obj) => Object.keys(obj))))
	);
</script>

<div class="inputs-container">
	<section class="text-inputs">
		<h2>Text Inputs</h2>
		<TextInput
			placeholder_props={{
				text: 'required',
				dynamic_styles: {
					invalid_styles: 'color: var(--text);',
					valid_styles: 'color: var(--text);'
				}
			}}
			show_confirm={false}
			label_props={{
				invalid_text: 'Please enter text between 3-16 characters.',
				text: 'Labels for Inputs',
				tooltip_props: { content: `I'm a plain text input with a cancel button!`, position: 'top' }
			}}
			dynamic_input_styles={{
				invalid_styles: 'background: oklch(70% 0.1 30 / 0.4);',
				valid_styles: 'background: oklch(70% 0.1 130 / 0.3);'
			}}
			autocomplete="off"
			required={true}
			pattern={'[a-z]{3,16}'}
			--input-invalid-outline="var(--accent) 2px solid"
		/>
		<TextInput
			bind:value={valid_email}
			placeholder_props={{ text: 'john@example.com' }}
			label_props={{
				invalid_text: 'Invalid email address.',
				text: 'Email address:',
				tooltip_props: {
					content: `I'm an email input that hides the confirm button when the email is invalid!`
				}
			}}
			dynamic_input_styles={{
				invalid_styles: 'background: oklch(70% 0.1 30 / 0.4);',
				valid_styles: 'background: oklch(70% 0.1 130 / 0.3);'
			}}
			type="email"
			autocomplete="email"
			required={true}
			onconfirm={() => {
				alert(`Email confirmed!  ${valid_email}`);
			}}
			--input-invalid-outline="var(--accent) 2px solid"
		/>

		<DatalistTextInput
			{datalist}
			value_key={'icon'}
			bind:value={selected_fruit_name}
			required={true}
			onconfirm={() => alert(`Selected fruit:  ${selected_fruit_name}`)}
			placeholder_props={{ text: 'Pick a fruit' }}
			label_props={{ text: 'Datalist Text Input:', invalid_text: 'Please enter a valid fruit.' }}
			--input-invalid-outline="var(--accent) 2px solid"
		/>
	</section>
	<section class="date-inputs">
		<h2>Date Inputs</h2>
		{#each date_inputs as input}
			<TemporalDateInput {...input} {...input.input_attributes} />
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
	<section class="select-inputs grid gap-4">
		<h2>Select Inputs</h2>
		<Select
			input_label_props={{ text: 'Select an object option' }}
			options={select_options}
			placeholder_props={{ text: 'pick one...' }}
			required={true}
			label_key={'label'}
			bind:value={selected_option}
		/>
		<Inspect value={selected_option} />
		<Select
			bind:value={value_key}
			input_label_props={{ text: 'Value Key ' }}
			placeholder_props={{ text: 'pick a value key' }}
			options={option_keys}
		/>
		<Select
			bind:value={label_key}
			input_label_props={{ text: 'Label Key ' }}
			placeholder_props={{ text: 'pick a label key' }}
			options={option_keys}
		/>
		<Select
			bind:value={selected_number}
			input_label_props={{
				text: 'Derived select with dynamic label/value key selection from an array of objects'
			}}
			options={select_options}
			{value_key}
			{label_key}
		/>
		<Select
			bind:value={selected_fruit}
			options={datalist}
			input_label_props={{ text: 'Select a fruit' }}
			placeholder_props={{ text: 'pick a fruit...' }}
		>
			{#snippet option_snippet(fruit)}
				<option value={fruit}>{fruit.label}</option>
			{/snippet}
		</Select>
	</section>

	<section class="checkbox-inputs">
		<h2>Checkbox Inputs</h2>
		<Checkbox label="Regular Checkbox" />
		<Checkbox>
			{#snippet label()}
				<p>Labeled Checkbox</p>
				<strong
					style="display: grid; place-content: center; color: var(--background); background-color: var(--accent); padding: 0.5rem"
					>with custom html!</strong
				>
			{/snippet}
		</Checkbox>
		<Checkbox disabled label={'Disabled Checkbox'} />
	</section>
	<section class="radio-inputs">
		<h2>Radio Inputs</h2>
		<RadioGroup
			items={datalist}
			bind:group={selected_fruit}
			label_attributes={{
				style: 'font-style: italic;  text-align: center;'
			}}
		>
			{#snippet children(item)}
				<span
					class="selected-fruit"
					style="transition: scale 300ms ease; place-self: center;"
					style:scale={selected_fruit?.label === item.label ? 1.5 : 1}>{item?.icon}</span
				>
			{/snippet}
		</RadioGroup>
		<RadioGroup
			items={select_options.flatMap((o) => {
				return o.options ? o.options : [];
			})}
			bind:group={selected_number}
			value_key={'value'}
		/>
	</section>
</div>

<style lang="scss">
	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
	.inputs-container {
		display: flex;
		justify-content: space-evenly;
		width: 100%;
		height: 100%;
		gap: 2rem 1rem;
		flex-wrap: wrap;
		padding: 2rem;
		& > * {
			flex-basis: max(15rem, 15vw);
			flex-grow: 1;
			flex-shrink: 1;
		}
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
	.radio-inputs {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		& :global(label) {
			flex-grow: 1;
			flex-shrink: 1;
			flex-basis: min(100%, 10ch);
		}
	}
	.date-inputs {
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
