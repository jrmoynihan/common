<script module lang="ts">
	import type {
		align_content_options,
		align_items_options,
		align_self_options,
		justify_content_options,
		justify_items_options,
		justify_self_options,
		overflow_options
	} from '$functions/helpers.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TrackConfig {
		size: string;
		min?: string;
		max?: string;
		resizable?: boolean;
	}
	export interface BaseGridProps extends HTMLAttributes<HTMLElement> {
		/** A declarative array defining the size and resizability of columns. */
		columns: (string | TrackConfig)[];
		/** A declarative array defining the size and resizability of rows. */
		rows: (string | TrackConfig)[];
		/** The tag of the grid (default: div). */
		tag?: keyof HTMLElementTagNameMap;
		/** The template areas of the grid. */
		template_areas?: string;
		/** The gap between grid items (default: 1rem. */
		gap?: string;
		/** The gap between columns (default: 1px).  Will override the `gap` property if set. */
		col_gap?: string;
		/** The gap between rows (default: 1px).  Will override the `gap` property if set. */
		row_gap?: string;
		/** The overflow of the grid (default: hidden).  */
		overflow?: keyof typeof overflow_options;
		/** The inline alignment of the grid's content (default: normal). */
		justify_content?: keyof typeof justify_content_options;
		/** The inline alignment of the grid items (default: normal). */
		justify_items?: keyof typeof justify_items_options;
		/** The inline alignment of the grid element itself (default: normal). */
		justify_self?: keyof typeof justify_self_options;
		/** The block alignment of the grid's content (default: normal). */
		align_content?: keyof typeof align_content_options;
		/** The block alignment of the grid items (default: normal). */
		align_items?: keyof typeof align_items_options;
		/** The block alignment of the grid element itself (default: normal). */
		align_self?: keyof typeof align_self_options;
		/** The size of the divider (default: 8px). */
		divider_size?: string;
		/** The margin of the divider (default: 4px). */
		divider_margin?: string;
	}
	export type ResizableGridProps<T extends keyof HTMLElementTagNameMap = 'div'> = BaseGridProps &
		HTMLAttributes<HTMLElementTagNameMap[T]>;
</script>

<script lang="ts">
	let {
		tag = 'div',
		columns,
		rows,
		template_areas,
		gap = '1px',
		col_gap = '1px',
		row_gap = '1px',
		overflow,
		justify_content,
		justify_items,
		justify_self,
		align_content,
		align_items,
		align_self,
		divider_size = '8px',
		divider_margin = '4px',
		children,
		...attributes
	}: ResizableGridProps = $props();

	// Context/State for Resizing
	let container = $state<HTMLElement>();
	let is_dragging = $state(false);
	let dragging_track_index = $state(-1);
	let dragging_axis = $state<'col' | 'row' | null>(null);
	let initial_position = $state({ x: 0, y: 0 });
	let initial_track_size = $state(0);
	let should_invert_drag = $state(false);

	function processTracks(tracks: (string | TrackConfig)[], type: 'col' | 'row') {
		return tracks
			.map((track, i) => {
				const config = typeof track === 'object' ? track : { size: track };
				const resizable = config.resizable || track === 'resizable';
				const initial = config.size || '1fr';
				const min = config.min || '0';
				const max = config.max || 'none';

				if (resizable) {
					const sizeVar = `--grid-${type}-${i}-size`; // Renamed for clarity

					// Initialize the custom property if not set
					if (container && !container.style.getPropertyValue(sizeVar)) {
						container.style.setProperty(sizeVar, initial);
					}

					// 🛠️ FIX: The custom property is the value that the track attempts to reach.
					// It is constrained by the min/max of the minmax function.

					// If the user specified a hard max (e.g., '3fr'), use that as the max constraint.
					// Otherwise, use the CSS variable as the max constraint.
					const maxConstraint =
						max === 'none'
							? `var(${sizeVar}, ${initial})` // No hard max: let the JS-set variable control the size
							: max; // Hard max: JS variable is constrained by the user's max

					// We use minmax(min, max_constraint)
					return `minmax(${min}, ${maxConstraint})`;
				} else {
					// Non-resizable tracks use minmax(min, max) directly.
					if (config.min || config.max) {
						return `minmax(${min}, ${max})`;
					}
					return initial;
				}
			})
			.join(' ');
	}

	const template_columns = $derived(container ? processTracks(columns, 'col') : '1fr');
	const template_rows = $derived(container ? processTracks(rows, 'row') : '1fr');

	// ----------------------------------------------------------------------
	// Dragging Handlers
	// ----------------------------------------------------------------------

	function startDrag(e: MouseEvent, index: number, axis: 'col' | 'row', is_last: boolean) {
		e.preventDefault();
		e.stopPropagation(); // Prevent text selection/unwanted events

		if (!container) return;
		console.log('startDrag', e, index, axis);

		is_dragging = true;
		dragging_track_index = index;
		dragging_axis = axis;
		initial_position = { x: e.clientX, y: e.clientY };
		should_invert_drag = is_last;

		// --- Improved initial_track_size retrieval ---
		const propName = `--grid-${axis}-${index}-size`;
		const initialValue = container.style.getPropertyValue(propName);

		// Check if the current value is already in pixels (from a previous drag)
		if (initialValue.endsWith('px')) {
			initial_track_size = parseFloat(initialValue);
		} else {
			// If it's '1fr' or another unit, we must measure the DOM.
			// A direct measurement is still required here for accuracy.

			// TEMPORARY FALLBACK: Use getComputedStyle on the container.
			const sizeProp = axis === 'col' ? 'gridTemplateColumns' : 'gridTemplateRows';
			const computed = window.getComputedStyle(container);
			const trackSizes = computed.getPropertyValue(sizeProp).split(/\s+/);

			if (trackSizes[index]) {
				// This attempts to parse the calculated size (e.g., '100px')
				initial_track_size = parseFloat(trackSizes[index]) || 200;
			}
		}

		document.addEventListener('mousemove', onDrag);
		document.addEventListener('mouseup', onEndDrag);
	}

	function onDrag(e: MouseEvent) {
		// console.log('onDrag', e);
		if (!is_dragging || !container || dragging_track_index === -1) return;

		let delta =
			dragging_axis === 'col' ? e.clientX - initial_position.x : e.clientY - initial_position.y;

		// 🔑 APPLY INVERSION: If dragging the last column, a positive delta (drag right)
		// should decrease the size, so we invert the delta.
		if (dragging_axis === 'col' && should_invert_drag) {
			delta *= -1;
		}

		let new_size = initial_track_size + delta;

		// Enforce a sensible minimum size in JS (e.g., 20px)
		new_size = Math.max(new_size, 20);

		console.log('new_size', new_size);
		// Update the CSS Custom Property (always using 'px' for drag control)
		const property = `--grid-${dragging_axis}-${dragging_track_index}-size`;
		container.style.setProperty(property, `${new_size}px`);
	}

	function onEndDrag() {
		is_dragging = false;
		dragging_track_index = -1;
		document.removeEventListener('mousemove', onDrag);
		document.removeEventListener('mouseup', onEndDrag);
	}
</script>

<svelte:element
	this={tag}
	bind:this={container}
	style:--divider-size={divider_size}
	style:--divider-margin={divider_margin}
	style:--grid-template-columns={template_columns}
	style:--grid-template-rows={template_rows}
	style:--grid-template-areas={template_areas}
	style:--grid-gap={gap}
	style:--grid-col-gap={col_gap}
	style:--grid-row-gap={row_gap}
	style:--grid-overflow={overflow}
	style:--grid-justify-content={justify_content}
	style:--grid-justify-items={justify_items}
	style:--grid-justify-self={justify_self}
	style:--grid-align-content={align_content}
	style:--grid-align-items={align_items}
	style:--grid-align-self={align_self}
	{...attributes}
	class={['_grid_resizable', attributes.class]}
>
	{#each columns.slice(0, columns.length - 1) as track, i}
		{@const currentIsResizable =
			track === 'resizable' || (typeof track === 'object' && track.resizable)}
		{@const nextTrack = columns[i + 1]}
		{@const nextIsResizable =
			nextTrack === 'resizable' || (typeof nextTrack === 'object' && nextTrack.resizable)}
		{@const targetIndex = nextIsResizable ? i + 1 : i}
		{@const should_invert = targetIndex === columns.length - 1}
		{#if currentIsResizable || nextIsResizable}
			<button
				class="resizer col"
				aria-label="Resize column"
				style:grid-column-start={i + 1}
				style:grid-column-end={i + 1}
				style:grid-row-start={1}
				style:grid-row-end={-1}
				onmousedown={(e) => startDrag(e, should_invert ? i + 1 : targetIndex, 'col', should_invert)}
			></button>
		{/if}
	{/each}

	{#each rows as track, i}
		{@const currentIsResizable =
			track === 'resizable' || (typeof track === 'object' && track.resizable)}

		{#if currentIsResizable}
			<button
				class="resizer row"
				aria-label="Resize row"
				style:grid-row-start={i + 2}
				style:grid-row-end={i + 2}
				style:grid-column-start={1}
				style:grid-column-end={-1}
				onmousedown={(e) => startDrag(e, currentIsResizable ? i : i + 1, 'row', false)}
			></button>
		{/if}
	{/each}
	{@render children?.()}
</svelte:element>

<style>
	@layer common.grid {
		._grid_resizable {
			position: relative;
			display: grid;
			grid-template-columns: var(--grid-template-columns);
			grid-template-rows: var(--grid-template-rows);
			grid-template-areas: var(--grid-template-areas);
			gap: var(--grid-gap);
			column-gap: var(--grid-col-gap, var(--grid-gap));
			row-gap: var(--grid-row-gap, var(--grid-gap));
			justify-content: var(--grid-justify-content);
			justify-items: var(--grid-justify-items);
			justify-self: var(--grid-justify-self);
			align-content: var(--grid-align-content);
			align-items: var(--grid-align-items);
			align-self: var(--grid-align-self);
			overflow: var(--grid-overflow);
			user-select: none;
			&:hover > .resizer:not(:active, :focus-visible) {
				background: oklch(from currentColor l c h / 0.05);
			}
		}
		.resizer {
			position: absolute;
			z-index: 10;
			background: transparent; /* Invisible handle */
			touch-action: none; /* Prevent scroll interference */
			/* Target the gap region using the specific grid line */
			margin: calc(var(--grid-gap) / -2);
			transition-property: scale, padding, background;
			transition-duration: 200ms;
			transition-timing-function: ease-in-out;
			&:hover:not(:active, :focus-visible) {
				background: oklch(from currentColor l c h / 0.1);
			}
			&:active,
			&:focus-visible {
				background: oklch(from currentColor l c h / 0.3);
			}
			&.col {
				cursor: col-resize;
				width: var(--divider-size);
				height: 100%;
				/* margin-inline: auto; */
				top: 0;
				bottom: 0;
				right: calc(var(--grid-col-gap, var(--grid-gap)) * -1);
				scale: 0.2 1;
				&:hover {
					scale: 1 1;
					padding: calc(var(--grid-gap));
				}
				&:active {
					scale: 1.05 1;
				}
			}

			&.row {
				cursor: row-resize;
				height: var(--divider-size);
				width: 100%;
				margin-block: auto;
				top: calc(var(--grid-row-gap, var(--grid-gap)) * -2 - var(--divider-size));
				scale: 1 0.2;
				&:hover {
					scale: 1 1;
				}
				&:active {
					scale: 1 1.05;
				}
			}
		}
	}
</style>
