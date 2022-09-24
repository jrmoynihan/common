<script lang="ts">
	import { dynamicStyle } from '$lib/actions/dynamic-styles.js';
	export let placeholder = '';
	export let styles = '';
	export let focus_styles = '';
	export let hover_styles = '';
</script>

<div class="placeholder" use:dynamicStyle={{ styles, focus_styles, hover_styles }}>
	{placeholder ?? ''}
</div>

<style lang="scss">
	.placeholder {
		font-size: var(--text-input-placeholder-font-size, 1rem);
		inset: 0;
		transition: all ease-in-out 300ms;
		pointer-events: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		opacity: 0.6;
		display: grid;
		box-sizing: border-box;
		grid-row: 1;
		grid-column: 1;
		height: 100%;
		padding: var(--text-input-padding, 1.25rem);
		color: var(--text-input-color, black);
	}
</style>
