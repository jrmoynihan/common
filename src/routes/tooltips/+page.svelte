<script lang="ts">
	import { tooltip, type TooltipDirections } from '$lib/tooltip/tooltip-action';
	import Fa from 'svelte-fa';
	import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons/index';
	import { fly } from 'svelte/transition';
	let selected_position: TooltipDirections = 'left';
	let positions = ['top', 'bottom', 'left', 'right'];
	let max_width: number = 150;
	let keep_visible = false;
	let disabled = false;
	let dynamic_tooltip_text =
		'Type in the text input while hovering the parent element to see the magic happen!';
	let custom_CSS_rules: [string, string][] = [
		['max-width', `${max_width}px`],
		['--tooltip-color', 'black'],
		['--tooltip-font-weight', '600'],
		['--tooltip-font-size', '1.5rem'],
		['--tooltip-background-color', 'yellow']
	];

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<section>
	<div class="settings full-width">
		{#each positions as position}
			<label>
				<input type="radio" bind:group={selected_position} value={position} />
				{capitalize(position)}
			</label>
		{/each}
		<label>
			Disable Tooltip:
			<input type="checkbox" bind:checked={disabled} />
		</label>
		<label>
			Keep Tooltip Visible:
			<input type="checkbox" bind:checked={keep_visible} />
		</label>
	</div>

	<h3
		class="full-width"
		use:tooltip={{
			keep_visible,
			disabled,
			title: `This is a tooltip positioned on top (by default). It will automatically reposition itself to stay within the viewport.`,
			css: [['max-width', `min(100vw, 200px)`]]
		}}
	>
		A Regular Tooltip
	</h3>
	<h3
		use:tooltip={{
			position: selected_position,
			title: dynamic_tooltip_text,
			disabled,
			delay: 150,
			css: [['max-width', 'min(100vw, 200px)']],
			keep_visible
		}}
	>
		Dynamically Updating Tooltip Text
	</h3>
	<input type="text" class="tooltip-text-input" bind:value={dynamic_tooltip_text} />

	<h3
		use:tooltip={{
			position: selected_position,
			delay: 300,
			title: keep_visible ? `I'll stick around` : `I'll disappear`,
			keep_visible,
			disabled
		}}
	>
		Tooltips Can Stay Visible Or Be Disabled
	</h3>
	<h3
		use:tooltip={{
			position: selected_position,
			title: `I'm so stylin'!`,
			show_arrow: false,
			disabled,
			keep_visible,
			delay: 200,
			transition: fly,
			transition_config: {
				duration: 500,
				x: -50,
				y: -50
			},
			horizontal_offset: 10,
			vertical_offset: -30,
			css: custom_CSS_rules
		}}
	>
		Tooltips Can Be Styled
	</h3>
	<div
		style="display:grid; grid-template-columns: repeat(3, minmax(0,max-content)); column-gap: 0.5rem; row-gap:1rem;"
		use:tooltip={{
			delay: 600,
			title: 'There are different delays on each the tooltips to achieve a staggered effect',
			disabled: !keep_visible,
			keep_visible,
			position: 'left',
			vertical_offset: -200
		}}
	>
		<h4>Rule</h4>
		<h4>Value</h4>
		<div />
		{#each custom_CSS_rules as [rule, value]}
			<input type="text" bind:value={rule} />
			<input type="text" bind:value />
			<button
				class="delete"
				on:click={() =>
					(custom_CSS_rules = custom_CSS_rules.filter((r) => r[0] !== rule && r[1] !== value))}
				><Fa icon={faTrash} size="lg" /></button
			>
		{/each}
		<button class="add" on:click={() => (custom_CSS_rules = [...custom_CSS_rules, ['', '']])}
			><Fa icon={faPlus} />Add CSS Rule</button
		>
	</div>
</section>

<style lang="scss">
	section {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		place-items: center;
		max-width: 80%;
		justify-content: center;
		margin: auto;
	}
	.settings {
		display: flex;
		gap: 1rem;
		place-content: center;
	}
	.full-width {
		width: 100%;
	}
	label {
		display: inline-flex;
		max-width: max-content;
		place-items: center;
		margin: auto;
		gap: 0.5rem;
	}
	button {
		border-radius: 1rem;
		padding: 0.5rem 1rem;
		&.delete {
			background-color: darkred;
			color: white;
		}
		&.add {
			background-color: green;
			color: white;
			grid-column: 1 / span 2;
			display: flex;
			gap: 1rem;
			place-items: center;
			place-content: center;
		}
	}
	h3 {
		background-color: seagreen;
		padding: 1rem;
		margin: auto;
		max-width: max-content;
	}
	h4 {
		text-align: center;
	}
	input {
		box-sizing: border-box;
		padding: 1rem;
		border-radius: 1rem;
		margin: auto;
	}
</style>
