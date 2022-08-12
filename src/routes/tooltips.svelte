<script lang="ts">
	import { tooltip, type TooltipDirections } from '$lib/tooltip/tooltip-action';
	let selected_position: TooltipDirections = 'left';
	let positions = ['top', 'bottom', 'left', 'right'];
	let innerWidth: number;
	let max_width: number = 150;
	let keep_visible = true;
	let dynamic_tooltip_text = 'This is a tooltip whose text can be updated';

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<svelte:window bind:innerWidth />
<section>
	{#each positions as position}
		<label>
			<input type="radio" bind:group={selected_position} value={position} />
			{capitalize(position)}
		</label>
	{/each}
	<input type="range" bind:value={max_width} min={0} max={innerWidth} />

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
			keep_visible
		}}
	>
		Tooltips Can Stay Visible
	</h2>
	<label>
		Check Here to Keep Tooltip Visible:
		<input type="checkbox" bind:checked={keep_visible} />
	</label>
	<h2
		use:tooltip={{
			position: selected_position,
			title: `Tooltips can be styled`,
			css: [
				['max-width', `${max_width}px`],
				['--tooltip-color', 'white'],
				['--tooltip-font-weight', '600'],
				['--tooltip-font-size', '1.5rem'],
				['--tooltip-background-color', 'blue']
			]
		}}
	>
		A Tooltip That Can Be Styled
	</h2>
</section>

<style lang="scss">
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
