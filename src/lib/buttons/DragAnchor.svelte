<script lang="ts" module>
	export interface DragAnchorProps<T> extends ButtonProps<T> {
		grabbed?: boolean;
		hovered?: boolean;
		dynamic_styles?: DynamicStyleParameters;
	}
</script>

<script lang="ts" generics="T">
	import { type DynamicStyleParameters } from '$actions/dynamic-styles.svelte';
	import { faGripVertical } from '@fortawesome/free-solid-svg-icons/index';
	import ButtonRunes, { type ButtonProps } from './Button_Runes.svelte';

	let {
		hovered = $bindable(false),
		grabbed = $bindable(false),
		disabled = $bindable(),
		dynamic_styles,
		children,
		...button_props
	}: DragAnchorProps<T> = $props();

	export const release = () => {
		if (!grabbed) return;
		grabbed = false;
	};
	export const grab = () => {
		if (grabbed) return;
		grabbed = true;
	};
</script>

<ButtonRunes
	bind:disabled
	icon_props={{ icon: faGripVertical }}
	classes={`drag-anchor ${!hovered ? 'faded' : ''} ${grabbed ? 'grabbed' : ''}`}
	dynamic_styles={{
		hover_styles: 'color: oklch(from var(--text) l c h / 1);',
		...dynamic_styles
	}}
	onmousedown={grab}
	onmouseup={release}
	onblur={release}
	{...button_props}
>
	{@render children?.()}
</ButtonRunes>

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
