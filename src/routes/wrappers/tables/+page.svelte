<script lang="ts">
	import { enumerate_runed_properties } from '$functions/helpers.svelte';
	import Input from '$inputs/Input.svelte';
	import Table, { type DataCell } from '$wrappers/Table.svelte';
	import { fly } from 'svelte/transition';

	function get_random_date() {
		const start = new Date(1950, 0, 1);
		const end = new Date();
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}
	function find_age_in_years(birthday: Date, today: Date) {
		return Math.floor((today.getTime() - birthday.getTime()) / (1000 * 60 * 60 * 24 * 365));
	}
	const names = [
		'John',
		'Jane',
		'Bob',
		'Alice',
		'Charlie',
		'David',
		'Eve',
		'Frank',
		'Grace',
		'Henry',
		'Ivy',
		'Jack',
		'Kate',
		'Luke',
		'Mary',
		'Nancy',
		'Olivia',
		'Peter',
		'Quinn',
		'Rose',
		'Sam',
		'Tom',
		'Ursula',
		'Violet',
		'Walter',
		'Xavier',
		'Yvonne',
		'Zoe'
	];
	class Person {
		id: string = $state<string>(crypto.randomUUID());
		name: string = $state('');
		birthday: Date = $state(get_random_date());
		name_length: number = $derived(this.name.length);
		age: number = $derived(find_age_in_years(this.birthday, new Date()));
		say_name = async () => {
			console.log(this.name);
		};

		constructor(initial_name: string) {
			this.name = initial_name;
			enumerate_runed_properties(this);
		}
	}

	let data = $state<Person[]>(names.map((name) => new Person(name)));
</script>

{#snippet custom_data_cell({ datum, key }: DataCell<Person>)}
	{#if key === 'birthday'}
		<td>
			<Input
				type="date"
				value={datum.birthday.toISOString().split('T')[0]}
				oninput={(e) => (datum.birthday = new Date(e?.currentTarget.value))}
			/>
		</td>
	{:else if key === 'age'}
		<td class:young={datum.age < 30} class:old={datum.age >= 45}>
			<div class="shared-grid age">
				{#key datum.age}
					<output in:fly={{ x: -50 }} out:fly={{ x: 50 }}>
						{datum.age}
					</output>
				{/key}
			</div>
		</td>
	{:else if key === 'name_length'}
		<td>
			<div class="shared-grid name-length">
				{#key datum.name_length}
					<output in:fly={{ x: -50 }} out:fly={{ x: 50 }}>
						{datum.name_length}
					</output>
				{/key}
			</div>
		</td>
	{:else if key === 'name'}
		<td>
			<Input type="text" bind:value={datum.name} />
		</td>
	{/if}
{/snippet}

<div class="tables">
	<Table
		bind:data
		caption_text={'A Basic Table'}
		--table-border-radius={'1rem'}
		visible_keys={['name', 'name_length', 'birthday', 'age']}
		data_cell={custom_data_cell}
	>
		{#snippet footer()}
			<tfoot>
				<tr>
					<td colspan="5">This is a long footer row!</td>
				</tr>
			</tfoot>
		{/snippet}
	</Table>
</div>

<style>
	.tables {
		justify-self: center;
	}
	td {
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--table-border-color);
		&.young {
			background-color: hsl(195, 61%, 74%);
		}
		&.old {
			background-color: hsl(195, 61%, 34%);
			color: white;
		}
	}
	.shared-grid {
		display: grid;
		&.age {
			grid-template-areas: 'age';
			& > output {
				grid-area: age;
			}
		}
		&.name-length {
			grid-template-areas: 'name-length';
			& > output {
				grid-area: name-length;
			}
		}
	}
</style>
