<script lang="ts">
	import NumericInput from '$inputs/NumericInput.svelte';
	import Select from '$inputs/Select.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import Flex from '$wrappers/Flex.svelte';
	import FlexItem from '$wrappers/FlexItem.svelte';
	import Grid from '$wrappers/Grid.svelte';

	const items = Array(12)
		.fill(0)
		.map((_, i) => ({ id: i, name: `Item ${i + 1}` }));
	let directions = ['row', 'column'];
	let wraps = ['wrap', 'nowrap', 'wrap-reverse'];
	let justifies = [
		'normal',
		'start',
		'end',
		'left',
		'right',
		'center',
		'space-between',
		'space-around',
		'space-evenly'
	];
	let overflows = ['hidden', 'scroll', 'auto'];
	let overflow = $state<'hidden' | 'scroll' | 'auto'>('hidden');
	let columns = $state(3);
	let rows = $state(2);
	let grow = $state(1);
	let shrink = $state(1);
	let basis = $state<string>('1fr');
	let direction = $state<'row' | 'column'>('row');
	let wrap = $state<'wrap' | 'nowrap' | 'wrap-reverse'>('wrap');
	let gap = $state<string>('1rem');
	let min_column_size = $state<string>('0');
	let max_column_size = $state<string>('1fr');
	let min_row_size = $state<string>('auto');
	let max_row_size = $state<string>('1fr');
	let justify_content = $state<
		| 'normal'
		| 'start'
		| 'end'
		| 'left'
		| 'right'
		| 'center'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
	>('normal');
</script>

<Grid rows={1} columns={3}>
	<fieldset>
		<legend>Grid Options</legend>
		<Flex wrap="wrap">
			<NumericInput
				label_props={{ text: 'Columns (numeric)' }}
				bind:value={columns}
				min={1}
				max={items.length}
			/>
			<Select bind:value={columns} input_label_props={{ text: 'Columns (keyword)' }}>
				<option value="auto-fit">auto-fit</option>
				<option value="auto-fill">auto-fill</option>
			</Select>
			<TextInput
				bind:value={min_column_size}
				show_confirm={false}
				label_props={{ text: 'Min Column Size' }}
			/>
			<TextInput
				bind:value={max_column_size}
				show_confirm={false}
				label_props={{ text: 'Max Column Size' }}
			/>
		</Flex>
		<Flex wrap="wrap">
			<NumericInput
				label_props={{ text: 'Rows (numeric)' }}
				bind:value={rows}
				min={1}
				max={items.length}
			/>
			<Select bind:value={rows} input_label_props={{ text: 'Rows (keyword)' }}>
				<option value="auto-fit">auto-fit</option>
				<option value="auto-fill">auto-fill</option>
			</Select>
			<TextInput
				bind:value={min_row_size}
				show_confirm={false}
				label_props={{ text: 'Min Row Size' }}
			/>
			<TextInput
				bind:value={max_row_size}
				show_confirm={false}
				label_props={{ text: 'Max Row Size' }}
			/>
		</Flex>
	</fieldset>
	<fieldset>
		<legend>Shared Options</legend>
		<TextInput bind:value={gap} show_confirm={false} label_props={{ text: 'Gap' }} />
		<Select bind:value={overflow} input_label_props={{ text: 'Overflow' }}>
			{#each overflows as overflow}
				<option value={overflow}>{overflow}</option>
			{/each}
		</Select>
	</fieldset>
	<fieldset>
		<legend>Flex Options</legend>
		<Flex wrap="wrap">
			<Select bind:value={direction}>
				{#each directions as direction}
					<option value={direction}>{direction}</option>
				{/each}
			</Select>
			<Select bind:value={wrap}>
				{#each wraps as wrap}
					<option value={wrap}>{wrap}</option>
				{/each}
			</Select>
			<Select bind:value={justify_content}>
				{#each justifies as justify}
					<option value={justify}>{justify}</option>
				{/each}
			</Select>
			<TextInput label_props={{ text: 'Basis' }} bind:value={basis} />
			<NumericInput label_props={{ text: 'Grow' }} bind:value={grow} min={0} max={items.length} />
			<NumericInput
				label_props={{ text: 'Shrink' }}
				bind:value={shrink}
				min={0}
				max={items.length}
			/>
		</Flex>
	</fieldset>
</Grid>
<Grid columns={'auto-fit'} gap="1rem">
	<fieldset>
		<legend>Grid</legend>
		<Grid
			{columns}
			{rows}
			{gap}
			{overflow}
			{min_column_size}
			{max_column_size}
			{min_row_size}
			{max_row_size}
		>
			{#each items as item}
				<div class="item">{item.name}</div>
			{/each}
		</Grid>
	</fieldset>
	<fieldset>
		<legend>Flex</legend>
		<Flex {gap} {justify_content} {direction} {wrap} {overflow}>
			{#each items as item}
				<FlexItem {basis} {grow} {shrink}>
					<div class="item">{item.name}</div>
				</FlexItem>
			{/each}
		</Flex>
	</fieldset>
</Grid>

<style lang="scss">
	.item {
		aspect-ratio: 3 / 2;
		border: 1px solid var(--accent);
		place-content: center;
		display: grid;
	}
	legend {
		font-weight: bold;
	}
</style>
