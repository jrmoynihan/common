<script lang="ts">
	import { dynamicStyle, type DynamicStyleParameters } from '$actions/dynamic-styles.svelte.js';

	interface PlaceholderProps {
		text?: string;
		dynamic_styles?: DynamicStyleParameters;
	}

	let { text, dynamic_styles }: PlaceholderProps = $props();
</script>

<div class="placeholder" use:dynamicStyle={dynamic_styles}>
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
		overflow: hidden;
		display: grid;
		box-sizing: border-box;
		grid-area: input;
		padding: var(--text-input-padding, 1.25em);
		color: gray;
		z-index: 0; /* addresses stacking context issue on the same grid-area */
		// height: 100%;  /* causes layout bug in Safari */
	}
</style>
