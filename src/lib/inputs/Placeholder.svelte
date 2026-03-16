<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export interface PlaceholderProps extends HTMLAttributes<HTMLDivElement> {
		text?: string;
		placeholder_element?: HTMLDivElement;
	}
</script>

<script lang="ts">
	let { placeholder_element = $bindable(), text, ...attributes }: PlaceholderProps = $props();
</script>

<div
	aria-hidden={true}
	role="presentation"
	inert
	bind:this={placeholder_element}
	{...attributes}
	class={[
		'_placeholder box-border grid overflow-auto text-ellipsis whitespace-nowrap transition-all duration-300 ease-in-out',
		attributes?.class
	]}
>
	{text ?? ''}
</div>

<style>
	@layer common.input.placeholder {
		._placeholder {
			--text: light-dark(dimgray, lightgray);
			user-select: none;
			font-size: var(--placeholder-font-size, 1em);
			font-style: var(--placeholder-font-style, normal);
			font-family: var(--placeholder-font-family, inherit);
			inset: 0;
			pointer-events: none;
			grid-area: input;
			padding: var(--text-input-padding, 1.25em);
			color: var(--placeholder-color, oklch(from var(--text) l c h / 0.7));
			z-index: 0; /* addresses stacking context issue on the same grid-area */
			/* height: 100%;  /* causes layout bug in Safari */
		}
	}
</style>
