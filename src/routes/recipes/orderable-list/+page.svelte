<script lang="ts">
	import DragAnchor from '$buttons/DragAnchor.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let items = [
		{ id: 1, name: 'Mario' },
		{ id: 2, name: 'Luigi' },
		{ id: 3, name: 'Yoshi' },
		{ id: 4, name: 'Peach' },
		{ id: 5, name: 'Toad' }
	];
	let dragTo: number;
	let dragFrom: number;
	let dragContent: (typeof items)[0];
	let grabbed = false;

	function draggingOver(i: number) {
		dragTo = i;
	}
	function draggingStart(i: number) {
		dragFrom = i;
		dragContent = items[i]!;
	}
	function dropped(dragContent: any, dragTo: number, dragFrom: number) {
		grabbed = false; // Make the it undraggable again until you click the handle
		const mutable_items = [...items];

		if (dragContent && dragTo !== undefined && dragFrom !== undefined) {
			const spliced = mutable_items.splice(dragFrom, 1); // Remove the dragged item
			const firstSlice = mutable_items.slice(0, dragTo); // Get the items before the drop point
			const endSlice = mutable_items.slice(dragTo, items.length - 1); // Get the items after the drop point
			if (firstSlice && spliced && endSlice) {
				const reordered_slices = [...firstSlice, ...spliced, ...endSlice]; // Combine the slices
				items = reordered_slices; // Update the state
			}
		}
	}
</script>

<div class="items" class:grabbed>
	{#each items as item, i (item.id)}
		{@const isDropTarget = i === dragTo && i !== dragFrom}
		{@const up = dragFrom > dragTo}
		{@const down = dragFrom < dragTo}
		<div
			animate:flip={{ duration: (d) => Math.sqrt(d) * 60 }}
			transition:fly={{ y: -100, duration: 300 }}
			class="item-container"
			role="listitem"
			aria-roledescription="draggable item"
			class:dragging={grabbed && i === dragFrom}
			class:targetedDown={grabbed && isDropTarget && down}
			class:targetedUp={grabbed && isDropTarget && up}
			draggable={grabbed}
			aria-grabbed={grabbed}
			onmouseover={() => draggingStart(i)}
			onfocus={() => draggingStart(i)}
			ondragover={(e) => {
				e.preventDefault();
				draggingOver(i);
			}}
			ondrop={(e) => {
				e.preventDefault();
				dropped(dragContent, dragTo, dragFrom);
			}}
		>
			{item.name}
			<div class="right">
				<DragAnchor bind:grabbed />
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.items {
		display: grid;
		width: 100%;
		gap: 1rem;
		transition: gap 300ms ease-in-out;
		transition-delay: 200ms;
		&.grabbed {
			gap: 1.5rem;
		}
	}
	.item-container {
		position: relative;
		display: flex;
		justify-items: center;
		justify-content: center;
		border: 1px solid hsla(0, 0%, 100%, 40%);
		border-radius: 1rem;
		padding: 1rem 3rem;
	}
	.right {
		display: flex;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		margin: 0.25rem;
	}
</style>
