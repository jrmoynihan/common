<script lang="ts" module>
	export interface DragAnchorProps extends HTMLButtonAttributes {
		grabbed?: boolean;
		hovered?: boolean;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import type {
		FocusEventHandler,
		HTMLButtonAttributes,
		MouseEventHandler,
		PointerEventHandler
	} from 'svelte/elements';

	let {
		hovered = $bindable(false),
		grabbed = $bindable(false),
		children,
		...button_attributes
	}: DragAnchorProps = $props();

	export const release = () => {
		if (!grabbed) return;
		grabbed = false;
	};
	export const grab = () => {
		if (grabbed) return;
		grabbed = true;
	};
	const pointerdown: PointerEventHandler<HTMLButtonElement> = (e) => {
		grab();
		button_attributes.onpointerdown?.(e);
	};
	const pointerup: PointerEventHandler<HTMLButtonElement> = (e) => {
		release();
		button_attributes.onpointerup?.(e);
	};
	const blur: FocusEventHandler<HTMLButtonElement> = (e) => {
		release();
		button_attributes.onblur?.(e);
	};
	const mousedown: MouseEventHandler<HTMLButtonElement> = (e) => {
		grab();
		button_attributes.onmousedown?.(e);
	};
	const mouseup: MouseEventHandler<HTMLButtonElement> = (e) => {
		release();
		button_attributes.onmouseup?.(e);
	};
</script>

<button
	{...button_attributes}
	onmousedown={mousedown}
	onmouseup={mouseup}
	onpointerdown={pointerdown}
	onpointerup={pointerup}
	onblur={blur}
	class={['_drag-anchor', !hovered && 'faded', grabbed, button_attributes?.class]}
>
	{@render children?.()}
	<Icon icon="fa6-solid:grip-vertical" />
</button>

<style>
	@layer common.drag-anchor {
		:global(._drag-anchor) {
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
	}
</style>
