<script lang="ts">
	import { tooltip, type TooltipDirections } from '$lib/tooltip/tooltip-action';
	let selected_position: TooltipDirections = 'left';
	let positions = ['top', 'bottom', 'left', 'right'];

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

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
<h3
	use:tooltip={{
		position: selected_position,
		title: `This is a tooltip normally positioned on the ${selected_position} side of the element, but automatically flipped to the right to keep it in view.`
	}}
>
	A Tooltip Responding to the Edge of the Viewport
</h3>

<style lang="scss">
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
</style>
