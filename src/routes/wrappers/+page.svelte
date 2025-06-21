<script lang="ts">
	import {
		direction_options,
		justify_items_options,
		justify_self_options,
		wrap_options
	} from '$functions/helpers.svelte';
	import NumericInput from '$inputs/NumericInput.svelte';
	import Select from '$inputs/Select.svelte';
	import TextInput from '$inputs/TextInput.svelte';
	import {
		align_content_options,
		align_items_options,
		justify_content_options,
		overflow_options
	} from '$lib';
	import Flex, { type FlexProps } from '$wrappers/Flex.svelte';
	import FlexItem, { type FlexItemProps } from '$wrappers/FlexItem.svelte';
	import Grid, { type GridProps } from '$wrappers/Grid.svelte';

	const items = Array(12)
		.fill(0)
		.map((_, i) => ({ id: i, name: `Item ${i + 1}` }));

	let overflow = $state<FlexProps['overflow']>('hidden');
	let columns = $state(3);
	let rows = $state(2);
	let grow = $state<FlexItemProps['grow']>(1);
	let shrink = $state<FlexItemProps['shrink']>(1);
	let basis = $state<FlexItemProps['basis']>('1fr');
	let direction = $state<FlexProps['direction']>('row');
	let wrap = $state<FlexProps['wrap']>('wrap');
	let gap = $state<FlexProps['gap']>('1rem');
	let align_items = $state<GridProps['align_items']>('normal');
	let align_content = $state<GridProps['align_content']>('normal');
	let min_column_size = $state<GridProps['min_column_size']>('0');
	let max_column_size = $state<GridProps['max_column_size']>('1fr');
	let min_row_size = $state<GridProps['min_row_size']>('auto');
	let max_row_size = $state<GridProps['max_row_size']>('1fr');
	let justify_content = $state<FlexProps['justify_content']>('normal');
	let justify_self = $state<FlexProps['justify_self']>('normal');
	let align_self = $state<GridProps['align_self']>('normal');
	let justify_items = $state<GridProps['justify_items']>('normal');
</script>

<Grid rows={1} columns={'auto-fit'} min_column_size="min(20rem, 100vw)">
	<fieldset>
		<legend>Grid Options</legend>
		<Select
			bind:value={justify_self}
			options={Object.values(justify_self_options)}
			input_label_props={{ text: 'Justify Self' }}
		/>
		<Select
			bind:value={justify_items}
			options={Object.values(justify_items_options)}
			input_label_props={{ text: 'Justify Items' }}
		/>
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
	</fieldset>
	<fieldset>
		<legend>Shared Options</legend>
		<Flex wrap="wrap" direction="column" align_items="start">
			<TextInput bind:value={gap} show_confirm={false} label_props={{ text: 'Gap' }} />
			<Select bind:value={overflow} input_label_props={{ text: 'Overflow' }}>
				{#each Object.values(overflow_options) as overflow}
					<option value={overflow}>{overflow}</option>
				{/each}
			</Select>
			<Select
				bind:value={align_items}
				options={Object.values(align_items_options)}
				input_label_props={{ text: 'Align Items' }}
			/>
			<Select
				bind:value={align_content}
				options={Object.values(align_content_options)}
				input_label_props={{ text: 'Align Content' }}
			/>
			<Select
				bind:value={justify_content}
				options={Object.values(justify_content_options)}
				input_label_props={{ text: 'Justify Content' }}
			/>
		</Flex>
	</fieldset>
	<fieldset>
		<legend>Flex Options</legend>
		<Select
			bind:value={direction}
			options={Object.values(direction_options)}
			input_label_props={{ text: 'Flex Direction' }}
		/>
		<Select
			bind:value={wrap}
			options={Object.values(wrap_options)}
			input_label_props={{ text: 'Flex Wrap' }}
		/>
		<TextInput label_props={{ text: 'Basis' }} bind:value={basis} />
		<NumericInput label_props={{ text: 'Grow' }} bind:value={grow} min={0} max={items.length} />
		<NumericInput label_props={{ text: 'Shrink' }} bind:value={shrink} min={0} max={items.length} />
	</fieldset>
</Grid>
<Grid columns={'auto-fit'} gap="1rem" {align_items}>
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
			{justify_self}
			{justify_content}
			{justify_items}
			{align_self}
			{align_content}
			{align_items}
		>
			{#each items as item}
				<div class="item">{item.name}</div>
			{/each}
		</Grid>
	</fieldset>
	<fieldset>
		<legend>Flex</legend>
		<Flex
			{gap}
			{direction}
			{wrap}
			{overflow}
			{justify_content}
			{align_self}
			{align_content}
			{align_items}
		>
			{#each items as item}
				<FlexItem {basis} {grow} {shrink}>
					<div class="item">{item.name}</div>
				</FlexItem>
			{/each}
		</Flex>
	</fieldset>
</Grid>

<style>
	.item {
		aspect-ratio: 3 / 2;
		border: 1px solid var(--accent);
		place-content: center;
		display: grid;
	}
	legend {
		font-weight: bold;
	}
	fieldset {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: start;
		align-content: start;
		justify-content: start;
		& > :global(*) {
			flex-grow: 1;
			flex-shrink: 1;
		}
	}
</style>
