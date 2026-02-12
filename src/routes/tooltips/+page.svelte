<script lang="ts">
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import Input from '$inputs/Input.svelte';
	import { Grid } from '$lib';
	import {
		tooltip,
		type TooltipDirections,
		type TooltipProps
	} from '$lib/attach/tooltip/tooltip.svelte.js';
	import Icon from '@iconify/svelte';
	import { SvelteMap } from 'svelte/reactivity';
	let position: TooltipDirections = $state('top');
	let positions = ['top', 'bottom', 'left', 'right'];
	let max_width = 200;
	let disabled = $state(false);
	let visible = $state(false);
	let keep_visible = $state(false);

	// NOTE - These must be marked as derived because they depend on other $state() changes; otherwise, the tooltip's internal state will not be updated. */
	let content = $derived(
		`This is a tooltip positioned on the ${position}${position === 'top' ? ' (the default)' : ''}. It will automatically reposition itself to stay within the viewport and can update its position dynamically.`
	);

	let tooltip_props: TooltipProps = $derived({
		position,
		keep_visible,
		disabled,
		styles: 'max-width: min(100vw, 300px);',
		content,
		width: '10px'
	});

	let initially_visible_example = $state(true);
	let dynamic_tooltip_text_num = $state(0);
	let dynamic_tooltip_text = $state(
		'Type in the text input while hovering the parent element to see the magic happen!'
	);

	const styling_green_map = new SvelteMap<string, string>()
		.set('max-width', `${max_width}px`)
		.set('--tooltip-color', 'black')
		.set('--tooltip-font-weight', '600')
		.set('--tooltip-font-size', '1.5rem')
		.set('--tooltip-background', 'radial-gradient( white 30%, lightgreen)')
		.set('--tooltip-drop-shadow', '0px 0px 10px lime');

	const hot_sun_map = new SvelteMap<string, string>()
		.set('--tooltip-background', 'lightyellow')
		.set('box-shadow', '0px 0px 16px 8px orange');

	let styling_green_styles = $derived(convertMapToStyleString(styling_green_map));
	let hot_sun_styles = $derived(convertMapToStyleString(hot_sun_map));

	function convertMapToStyleString(map: SvelteMap<string, string>) {
		let styles = '';
		for (const [key, value] of map) {
			styles += `${key}: ${value}; `;
		}
		return styles;
	}

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	function hideAll() {
		disabled = true;
		visible = false;
		disabled = false;
	}
</script>

{#snippet tooltip_example({ text, num }: { text: string; num: number })}
	<button>example from a snippet: {text} {num}</button>
{/snippet}
<section id="tooltips-section">
	<div class="settings full-width">
		{#each positions as p}
			<label class="p-4">
				<Input type="radio" bind:group={position} value={p} />
				{capitalize(p)}
			</label>
		{/each}
		<label class="p-4">
			Disable Tooltip:
			<ToggleSwitch bind:checked={disabled} />
		</label>
		<label class="p-4">
			Keep Tooltip Visible:
			<ToggleSwitch bind:checked={keep_visible} />
		</label>
	</div>
	<button class="full-width" {@attach tooltip({ ...tooltip_props })}>
		Tooltips Can Adjust Their Position Automatically
	</button>
	<button
		class="full-width"
		{@attach tooltip({
			position,
			visible: initially_visible_example && visible,
			disabled,
			content: `This is a tooltip that is set to become visible as soon as its parent is mounted (after waiting for a specified delay). Mouseout its parent to hide the tooltip, or do it programmatically by clicking its parent button!`,
			styles: `max-width: min(100vw, 200px); ${hot_sun_styles}`
		})}
		onclick={() => (initially_visible_example = !initially_visible_example)}
	>
		Tooltips Can Be Used Without the Mouse
	</button>
	<button
		{@attach tooltip({
			content: dynamic_tooltip_text,
			position,
			disabled,
			styles: 'max-width: min(100vw, 200px);',
			keep_visible
		})}
	>
		Dynamically Updating Tooltip Text
	</button>
	<Input
		type="text"
		class="tooltip-text-input"
		bind:value={dynamic_tooltip_text}
		{@attach tooltip({ content: tooltip_example, args: { text: dynamic_tooltip_text, num: 0 } })}
	/>
	<Input
		type="number"
		bind:value={dynamic_tooltip_text_num}
		{@attach tooltip({
			content: tooltip_example,
			args: { num: dynamic_tooltip_text_num, text: dynamic_tooltip_text }
		})}
	/>

	<button
		{@attach tooltip({
			content: keep_visible
				? `I'll stick around. It's useful for debugging styles on the tip too!`
				: `I'll disappear after a short delay`,
			disabled,
			position
		})}
	>
		Tooltips Can Stay Visible Or Be Disabled
	</button>
	<button
		id="custom-component-button"
		{@attach tooltip({
			content: `I've got a <br/> custom component!`,
			visible,
			disabled,
			position
		})}
	>
		Tooltips Can Stay Visible Or Be Disabled
	</button>
	<button
		{@attach tooltip({
			content: `I'm so stylin'!`,
			show_arrow: false,
			disabled,
			style: hot_sun_styles,
			position
		})}
	>
		Tooltips Can Be Styled
	</button>
	<Grid
		columns={3}
		max_column_size="max-content"
		gap="1rem 0.5rem"
		{@attach tooltip({
			content: 'Try modifying the styles of the tooltip!',
			style: styling_green_styles,
			position
		})}
	>
		<div>Rule</div>
		<div>Value</div>
		<div></div>
		{#each styling_green_map.entries() as [rule, value]}
			<Input
				type="text"
				style="grid-area: unset"
				value={rule}
				onblur={(e) => styling_green_map.set(e.currentTarget.value, value)}
			/>
			<Input
				type="text"
				style="grid-area: unset"
				{value}
				oninput={(e) => styling_green_map.set(rule, e.currentTarget.value)}
			/>
			<button class="delete" onclick={() => styling_green_map.delete(rule)}>
				<Icon icon="fa6-solid:trash" class="h-4 w-4" />
			</button>
		{/each}
		<button class="add" style="grid-column: span 3;" onclick={() => styling_green_map.set('', '')}>
			<Icon icon="fa-solid:plus" class="h-4 w-4" />
			Add CSS Rule
		</button>
	</Grid>
</section>

<style>
	section {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		place-items: center;
		margin: auto;
		& :global(button) {
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
				scale: 0.98, 0.98, 1;
			}
		}
	}
	.settings {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
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
</style>
