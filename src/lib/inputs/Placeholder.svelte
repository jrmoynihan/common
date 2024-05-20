<script context="module" lang="ts">
	export interface PlaceholderProps {
		text?: string;
		dynamic_styles?: DynamicStyleParameters;
		placeholder_element?: HTMLDivElement;
	}
</script>

<script lang="ts">
	import { dynamic_style, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';

	let {
		dynamic_styles = $bindable(),
		placeholder_element = $bindable(),
		text,
		...attributes
	}: PlaceholderProps = $props();
</script>

<div
	bind:this={placeholder_element}
	class="placeholder"
	use:dynamic_style={dynamic_styles}
	{...attributes}
>
	{text ?? ''}
</div>

<style lang="scss">
	.placeholder {
		font-size: var(--placeholder-font-size, 1em);
		font-style: var(--placeholder-font-style, normal);
		font-family: var(--placeholder-font-family, inherit);
		inset: 0;
		transition: all ease-in-out 300ms;
		pointer-events: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: auto;
		display: grid;
		box-sizing: border-box;
		grid-area: input;
		padding: var(--text-input-padding, 1.25em);
		color: gray;
		z-index: 0; /* addresses stacking context issue on the same grid-area */
		// height: 100%;  /* causes layout bug in Safari */
	}
</style>
