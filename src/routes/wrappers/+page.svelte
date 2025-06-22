<script lang="ts">
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import {
		direction_options,
		grid_fit_options,
		justify_items_options,
		justify_self_options,
		wrap_options
	} from '$functions/helpers.svelte';
	import NumericInput from '$inputs/NumericInput.svelte';
	import RadioGroup from '$inputs/RadioGroup.svelte';
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
	let rows = $state(0);
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
	let justify_self = $state<GridProps['justify_self']>('normal');
	let align_self = $state<GridProps['align_self']>('normal');
	let justify_items = $state<GridProps['justify_items']>('normal');
	let grid_mode = $state<'Grid' | 'Flex' | 'Both'>('Both');
</script>

<Flex gap="1rem" style="margin: 1rem; text-align: center; ">
	<RadioGroup
		label_attributes={{ style: 'flex-basis: 33%; place-content: center; place-items: center;' }}
		bind:group={grid_mode}
		items={['Grid', 'Both', 'Flex']}
	/>
</Flex>
<Grid
	columns={3}
	min_column_size="min(20rem, 100vw)"
	max_column_size="1fr"
	class={['toggler', grid_mode === 'Grid' && 'show-grid', grid_mode === 'Flex' && 'show-flex']}
>
	<fieldset
		id="grid-options"
		style="grid-area: grid_options;"
		class:hide-grid={grid_mode === 'Flex'}
	>
		<legend>Grid Options</legend>
		<FlexItem>
			<Select
				bind:value={justify_self}
				options={Object.values(justify_self_options)}
				input_label_props={{ text: 'Justify Self' }}
			/>
		</FlexItem>
		<FlexItem>
			<Select
				bind:value={justify_items}
				options={Object.values(justify_items_options)}
				input_label_props={{ text: 'Justify Items' }}
			/>
		</FlexItem>
		<FlexItem>
			<NumericInput
				label_props={{ text: 'Columns (numeric)' }}
				bind:value={columns}
				min={1}
				max={items.length}
			/>
		</FlexItem>
		<FlexItem>
			<Select
				bind:value={columns}
				input_label_props={{ text: 'Columns (keyword)' }}
				options={Object.values(grid_fit_options)}
			/>
		</FlexItem>
		<FlexItem>
			<TextInput
				bind:value={min_column_size}
				show_confirm={false}
				label_props={{ text: 'Min Column Size' }}
			/>
		</FlexItem>
		<FlexItem>
			<TextInput
				bind:value={max_column_size}
				show_confirm={false}
				label_props={{ text: 'Max Column Size' }}
			/>
		</FlexItem>
		<FlexItem>
			<NumericInput
				label_props={{ text: 'Rows (numeric)' }}
				bind:value={rows}
				min={1}
				max={items.length}
			/>
		</FlexItem>
		<FlexItem>
			<Select
				bind:value={rows}
				input_label_props={{ text: 'Rows (keyword)' }}
				options={Object.values(grid_fit_options)}
			/>
		</FlexItem>
		<FlexItem>
			<TextInput
				bind:value={min_row_size}
				show_confirm={false}
				label_props={{ text: 'Min Row Size' }}
			/>
		</FlexItem>
		<FlexItem>
			<TextInput
				bind:value={max_row_size}
				show_confirm={false}
				label_props={{ text: 'Max Row Size' }}
			/>
		</FlexItem>
	</fieldset>
	<fieldset style="grid-area: shared_options">
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
	<fieldset
		id="flex-options"
		style="grid-area: flex_options;"
		class:hide-flex={grid_mode === 'Grid'}
	>
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
	<fieldset
		id="grid-example"
		style="grid-area: grid; grid-column: 1 / 3; transform-origin: left;"
		style:scale={grid_mode ? 1 : 0}
		style:opacity={grid_mode ? 1 : 0}
	>
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
	<fieldset
		id="flex-example"
		style="grid-area: flex; grid-column: 2 / 4; transform-origin: right;"
		style:scale={!grid_mode ? 1 : 0}
		style:opacity={!grid_mode ? 1 : 0}
	>
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
				<FlexItem {basis} {grow} {shrink} class="item grid">
					{item.name}
				</FlexItem>
			{/each}
		</Flex>
	</fieldset>
</Grid>

<style>
	:global(fieldset ._flex-item .item, fieldset .item) {
		border: 1px solid var(--accent);
		aspect-ratio: 3 / 2;
		text-align: center;
		place-content: center;
	}
	:global(.toggler) {
		margin-block-end: 5vh;
		transition:
			grid-template-columns 0.5s ease-in-out,
			grid-template-areas 0.5s ease-in-out;
		grid-template-areas:
			'grid_options shared_options flex_options'
			'grid _ flex';
		container-type: inline-size;
	}
	:global(.toggler) {
		grid-template-columns: 1fr 1fr 1fr;
		margin-inline: 2rem;
	}
	:global(.toggler.show-grid) {
		grid-template-columns: 1fr 1fr 0fr;
		margin-inline: 2rem -5rem;
	}
	:global(.toggler.show-flex) {
		grid-template-columns: 0fr 1fr 1fr;
		margin-inline: -5rem 2rem;
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
		transition-behavior: allow-discrete;
		&#grid-example {
			display: block;
			transition:
				scale 0.5s ease-in-out,
				opacity 0.5s ease-in-out,
				display 0.5s ease-in-out,
				translateX 0.5s ease-in-out;
			@starting-style {
				scale: 0;
				opacity: 0;
				display: none;
				translate: -100% 0;
			}
		}
		&#flex-example {
			display: block;
			transition:
				scale 0.5s ease-in-out,
				opacity 0.5s ease-in-out,
				display 0.5s ease-in-out,
				translateX 0.5s ease-in-out;
			@starting-style {
				scale: 0;
				opacity: 0;
				display: none;
				translate: 100% 0;
			}
		}
		&#grid-options {
			translate: 0 0;
			opacity: 1;
			&.hide-grid {
				animation: hide-left 0.5s ease-in-out forwards;
			}
		}
		&#flex-options {
			translate: 0 0;
			opacity: 1;
			&.hide-flex {
				animation: hide-right 0.5s ease-in-out forwards;
			}
		}
		& > :global(*) {
			flex-grow: 1;
			flex-shrink: 1;
			flex-basis: max(50px, calc(50% - 2rem));
		}
	}
	@keyframes hide-left {
		from {
			translate: 0 0;
			opacity: 1;
			scale: 1;
		}
		100% {
			translate: -100% 0;
			opacity: 0;
			scale: 0 100%;
		}
	}
	@keyframes hide-right {
		from {
			translate: 0 0;
			opacity: 1;
			scale: 1;
		}
		100% {
			translate: 100% 0;
			opacity: 0;
			scale: 0 100%;
		}
	}
</style>
