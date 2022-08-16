<script lang="ts">
	import { dev } from '$app/env';
	import { tooltip, type TooltipDirections } from '$lib/tooltip/tooltip-action';
	import { writable } from 'svelte/store';
	let selected_position: TooltipDirections = 'left';
	let positions = ['top', 'bottom', 'left', 'right'];
	let max_width: number = 150;
	let keep_visible = true;
	let disabled = false;
	let dynamic_tooltip_text = 'Type here while hovering the header above';
	let coords = writable({ x: 0, y: 0 });

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<svelte:window on:mousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })} />
{#if dev}
	<div class="top-left">
		<p>X: {$coords.x}</p>
		<p>Y: {$coords.y}</p>
	</div>
{/if}
<section>
	{#each positions as position}
		<label>
			<input type="radio" bind:group={selected_position} value={position} />
			{capitalize(position)}
		</label>
	{/each}

	<h2
		use:tooltip={{
			position: selected_position,
			title: `This is a tooltip positioned on the ${selected_position} side of the element`
		}}
	>
		A Regular Tooltip
	</h2>
	<h2
		use:tooltip={{
			position: selected_position,
			title: dynamic_tooltip_text
		}}
	>
		Dynamically Updating Tooltip Text
	</h2>
	<input type="text" bind:value={dynamic_tooltip_text} />
	<h3
		use:tooltip={{
			position: selected_position,
			title: `This is a tooltip normally positioned on the ${selected_position} side of the element, but automatically re-positioned to keep it in the viewport (the default).`
		}}
	>
		Tooltips Respond to the Edge of the Viewport
	</h3>

	<h2
		use:tooltip={{
			position: selected_position,
			title: keep_visible ? `I'll stick around` : `I'll disappear`,
			keep_visible,
			disabled
		}}
	>
		Tooltips Can Stay Visible
	</h2>
	<label>
		Disable Tooltip:
		<input type="checkbox" bind:checked={disabled} />
	</label>
	<label>
		Keep Tooltip Visible:
		<input type="checkbox" bind:checked={keep_visible} />
	</label>
	<h2
		use:tooltip={{
			position: selected_position,
			title: `Tooltips can be styled`,
			show_arrow: false,
			horizontal_offset: 10,
			vertical_offset: -50,
			css: [
				['max-width', `${max_width}px`],
				['--tooltip-color', 'black'],
				['--tooltip-font-weight', '600'],
				['--tooltip-font-size', '1.5rem'],
				['--tooltip-background-color', 'orange']
			]
		}}
	>
		A Tooltip That Can Be Styled
	</h2>
</section>

<style lang="scss">
	.top-left {
		position: fixed;
		top: 0;
		left: 0;
		padding: 1rem 2rem;
	}
	section {
		display: grid;
		gap: 1rem;
		place-items: center;
	}
	label {
		display: inline-flex;
		max-width: max-content;
	}
	h2,
	h3 {
		background-color: seagreen;
		padding: 1rem;
	}
	h2 {
		margin: auto;
		max-width: max-content;
	}
	h3 {
		max-width: max-content;
	}
	input {
		box-sizing: border-box;
		padding: 1rem;
		border-radius: 1rem;
		width: 50%;
	}
</style>
