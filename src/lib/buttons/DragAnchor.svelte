<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles';
	import { faGripVertical } from '@fortawesome/free-solid-svg-icons/index';
	import { Fa } from '@jrmoynihan/svelte-fa';

	export let hovered: boolean = false;
	export let grabbed: boolean = false;
	export let styles: string = '';
	export let focus_styles: string = '';
	export let hover_styles: string = '';
	export let active_styles: string = '';
</script>

<button
	use:dynamicStyle={{
		styles,
		focus_styles,
		hover_styles,
		active_styles
	}}
	class="drag-anchor"
	class:faded={!hovered}
	class:grabbed
	on:mousedown={() => (grabbed ? null : (grabbed = true))}
	on:mouseup={() => (grabbed ? (grabbed = false) : null)}
	on:blur={() => (grabbed ? (grabbed = false) : null)}
>
	<Fa icon={faGripVertical} />
</button>

<style lang="scss">
	.drag-anchor {
		box-sizing: border-box;
		display: grid;
		place-items: center;
		place-content: center;
		cursor: grab;
		width: 2rem;
		aspect-ratio: 1 / 1;
		padding: var(--drag-anchor-padding, 1rem);
		border-radius: var(--drag-anchor-border-radius, 1rem);
		transition: var(--drag-anchor-transition, opacity 200ms);
		// border: var(--drag-anchor-border, 2px solid inset);
		background: var(--drag-anchor-background, transparent);
		color: var(--drag-anchor-color, var(--text, inherit));
		&.grabbed {
			cursor: grabbing;
		}
		&.faded {
			opacity: var(--drag-anchor-faded-opacity, 0.2);
		}
		&:hover,
		&:focus-visible {
			color: var(--drag-anchor-hover-color, var(--drag-anchor-color));
			background: var(--drag-anchor-hover-background, var(--drag-anchor-background));
			opacity: var(--drag-anchor-hovered-opacity, 1);
		}
		&:active,
		&:not(:disabled):active {
			background: var(
				--active-drag-anchor-background,
				var(--drag-anchor-background, var(--active-button-background))
			);
		}
	}
</style>
