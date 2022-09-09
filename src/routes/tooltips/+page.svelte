<script lang="ts">
	import { tooltip, type TooltipDirections } from '$lib/tooltip/tooltip-action';
	import Fa from 'svelte-fa';
	import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons/index';
	import { fly } from 'svelte/transition';
	import ToggleSwitch from '$lib/buttons/ToggleSwitch.svelte';
	let selected_position: TooltipDirections = 'top';
	let positions = ['top', 'bottom', 'left', 'right'];
	let max_width: number = 150;
	let keep_visible = false;
	let disabled = false;
	let visible = false;
	let initially_visible_example = true;
	let dynamic_tooltip_text =
		'Type in the text input while hovering the parent element to see the magic happen!';
	let styling_green_CSS: [string, string][] = [
		['max-width', `${max_width}px`],
		['--tooltip-color', 'black'],
		['--tooltip-font-weight', '600'],
		['--tooltip-font-size', '1.5rem'],
		['--tooltip-background', 'radial-gradient( white 30%, lightgreen)'],
		['--tooltip-drop-shadow', '0px 0px 10px lime']
	];
	let hot_sun_CSS: [string, string][] = [
		['--tooltip-background', 'lightyellow'],
		['box-shadow', '0px 0px 16px 8px orange']
	];

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	function hideAll() {
		disabled = true;
		keep_visible = false;
		visible = false;
		disabled = false;
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
		<label for="disabled-toggle">
			Disable Tooltip:
			<!-- <input type="checkbox" bind:checked={disabled} /> -->
			<ToggleSwitch bind:checked={disabled} />
		</label>
		<label for="keep-visible-toggle">
			Keep Tooltip Visible:
			<!-- <input type="checkbox" bind:checked={keep_visible} /> -->
			<ToggleSwitch bind:checked={keep_visible} />
		</label>
		{#if keep_visible}
			<button
				transition:fly={{ x: 100, duration: 300 }}
				style="box-shadow: 0 0 14px 1px yellow;"
				on:click={hideAll}>Hide All Tooltips</button
			>
		{/if}
	</div>

	<button
		class="full-width"
		use:tooltip={{
			position: selected_position,
			keep_visible,
			visible,
			disabled,
			title: `This is a tooltip positioned on ${selected_position} ${
				selected_position === 'top' ? '(the default)' : ''
			}. It will automatically reposition itself to stay within the viewport and can update its position dynamically.`,
			css: [['max-width', `min(100vw, 200px)`]]
		}}
	>
		Tooltips Can Adjust Their Position Automatically
	</button>
	<button
		class="full-width"
		use:tooltip={{
			position: selected_position,
			visible: initially_visible_example && visible,
			keep_visible,
			disabled,
			visibility_delay: 900,
			title: `This is a tooltip that is set to become visible as soon as its parent is mounted (after waiting for a specified delay). Mouseout its parent to hide the tooltip, or do it programmatically by clicking its parent button!`,
			css: [['max-width', `min(100vw, 200px)`], ...hot_sun_CSS]
		}}
		on:click={() => (initially_visible_example = !initially_visible_example)}
	>
		Tooltips Can Be Used Without the Mouse
	</button>
	<button
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
	</button>
	<input type="text" class="tooltip-text-input" bind:value={dynamic_tooltip_text} />

	<button
		use:tooltip={{
			position: selected_position,
			delay: 300,
			title: keep_visible
				? `I'll stick around. It's useful for debugging styles on the tip too!`
				: `I'll disappear after a short delay`,
			keep_visible,
			disabled
		}}
	>
		Tooltips Can Stay Visible Or Be Disabled
	</button>
	<button
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
				x: -70,
				y: 70
			},
			css: styling_green_CSS
		}}
	>
		Tooltips Can Be Styled
	</button>
	<div
		style="display:grid; grid-template-columns: repeat(3, minmax(0,max-content)); column-gap: 0.5rem; row-gap:1rem;"
		use:tooltip={{
			delay: 600,
			title: 'There are different delays on each the tooltips to achieve a staggered effect',
			disabled: !keep_visible,
			keep_visible,
			css: hot_sun_CSS,
			position: 'left',
			vertical_offset: -200
		}}
	>
		<h4>Rule</h4>
		<h4>Value</h4>
		<div />
		{#each styling_green_CSS as [rule, value]}
			<input type="text" bind:value={rule} />
			<input type="text" bind:value />
			<button
				class="delete"
				on:click={() =>
					(styling_green_CSS = styling_green_CSS.filter((r) => r[0] !== rule && r[1] !== value))}
				><Fa icon={faTrash} size="lg" /></button
			>
		{/each}
		<button class="add" on:click={() => (styling_green_CSS = [...styling_green_CSS, ['', '']])}
			><Fa icon={faPlus} />Add CSS Rule</button
		>
	</div>
</section>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(0,1fr));">
	<button use:tooltip={{ title: 'tooltip' }}>Test</button>
	{#if keep_visible}
		<button transition:fly use:tooltip={{ title: 'hello', visible: true }}>Test</button>
	{/if}
</div>

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
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		grid-template-rows: 4rem;
		gap: 8rem;
		place-content: center;
		margin: 2rem;
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
		font-weight: bold;
		font-size: large;
		background: linear-gradient(darkcyan -70%, rgb(9, 94, 94) 25%, darkcyan 190%);
		margin: auto;
		max-width: max-content;
		border-radius: 20px 50px 20px 50px;
		padding: 1rem;
		color: white;
		border: none;
		transition: transform 250ms ease-in-out;
		&:active {
			transform: scale3d(0.98, 0.98, 1);
		}
		&.delete,
		&.add {
			border: initial;
			border-radius: 1rem;
		}
		&.delete {
			background-color: hsl(0, 41%, 41%);
		}
		&.add {
			background-color: darkcyan;
			grid-column: 1 / span 2;
			display: flex;
			gap: 1rem;
			place-items: center;
			place-content: center;
		}
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
	.tooltip-text-input {
		width: 100%;
	}
</style>
