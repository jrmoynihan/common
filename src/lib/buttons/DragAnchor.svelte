<script lang="ts">
	import { type DynamicStyleParameters } from '$actions/dynamic-styles';
	import { faGripVertical } from '@fortawesome/free-solid-svg-icons/index';
	import ButtonRunes from './Button_Runes.svelte';

	interface DragAnchorProps {
		grabbed?: boolean;
		hovered?: boolean;
		dynamic_styles?: DynamicStyleParameters;
	}
	let {
		hovered = $bindable(false),
		grabbed = $bindable(false),
		dynamic_styles
	}: DragAnchorProps = $props();

	function release() {
		if (!grabbed) return;
		grabbed = false;
	}
	function grab() {
		if (grabbed) return;
		grabbed = true;
	}
</script>

<!-- <button
	use:dynamicStyle={dynamic_styles}
	class="drag-anchor"
	class:faded={!hovered}
	class:grabbed
	on:mousedown={() => (grabbed ? null : (grabbed = true))}
	on:mouseup={() => (grabbed ? (grabbed = false) : null)}
	on:blur={() => (grabbed ? (grabbed = false) : null)}
>
	<Fa icon={faGripVertical} />
</button> -->

<ButtonRunes
	icon={faGripVertical}
	classes={`drag-anchor ${!hovered ? 'faded' : ''} ${grabbed ? 'grabbed' : ''}`}
	dynamic_styles={{
		hover_styles: 'color: oklch(from var(--text) l c h / 1);',
		...dynamic_styles
	}}
	attributes={{ onmousedown: grab, onmouseup: release, onblur: release }}
/>

<style lang="scss">
	@layer drag-anchor {
		:global(.drag-anchor) {
			--default-transition: opacity 200ms, color 200ms;
			box-sizing: border-box;
			display: grid;
			place-items: center;
			place-content: center;
			cursor: grab;
			width: 2rem;
			aspect-ratio: 1 / 1;
			padding: var(--drag-anchor-padding, 1rem);
			border-radius: var(--drag-anchor-border-radius, 1rem);
			transition: var(--drag-anchor-transition, var(--default-transition));
			// border: var(--drag-anchor-border, 2px solid inset);
			background: var(--drag-anchor-background, transparent);
			color: var(--drag-anchor-color, oklch(from var(--text, inherit) l c h / 0.2));

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
		:global(.button.drag-anchor.grabbed) {
			cursor: grabbing;
		}
		// :global(.button.drag-anchor.faded) {
		// opacity: var(--drag-anchor-faded-opacity, 0.2);
		// color: oklch(from currentColor l c h / 0.2);
		// }
	}
</style>
