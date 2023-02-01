<script lang="ts">
	import { dynamicStyle } from '$actions/dynamic-styles.js';
	import { tooltip, type TooltipParameters } from '$actions/tooltip/tooltip.js';
	import type { SelectOptionList } from '$inputs/types.js';
	import type { ComponentProps } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
	import OptionOrGroup from './OptionOrGroup.svelte';
	import Placeholder from './Placeholder.svelte';

	export let value: unknown = '';
	export let id = crypto?.randomUUID() ?? '';
	export let name = '';
	export let title = '';
	export let required = false;
	export let options: SelectOptionList = [];
	export let select_styles = '';
	export let select_hover_styles = '';
	export let select_focus_styles = '';
	export let select_active_styles = '';
	export let select_container_styles = '';
	export let select_container_hover_styles = '';
	export let select_container_focus_styles = '';
	export let select_container_active_styles = '';
	export let placeholder_props: ComponentProps<Placeholder> = {};
	export let transition: SvelteTransition = fade;
	export let transition_parameters: SvelteTransitionParams = { duration: 0 };
	export let use_tooltip = false;
	export let tooltip_options: TooltipParameters = {
		title,
		disabled: !use_tooltip
	};

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

<div
	class="select-container"
	use:dynamicStyle={{
		styles: select_container_styles,
		hover_styles: select_container_hover_styles,
		focus_styles: select_container_focus_styles,
		active_styles: select_container_active_styles
	}}
	transition:transition={transition_parameters}
	use:tooltip={{ ...tooltip_options }}
>
	<select
		class="select"
		class:value
		use:dynamicStyle={{
			styles: select_styles,
			hover_styles: select_hover_styles,
			focus_styles: select_focus_styles,
			active_styles: select_active_styles
		}}
		bind:value
		{required}
		{id}
		{name}
	>
		{#each options as option}
			<OptionOrGroup {option} />
		{/each}
		<slot name="options" />
	</select>
	{#key placeholder_props}
		<Placeholder {...placeholder_props} />
	{/key}
</div>

<style lang="scss">
	/* Avoid miscalculating size of padding/widths by including it in the box mesaurement */
	* {
		box-sizing: border-box;
	}
	.select-container {
		--text-input-padding: 1.25rem;
		position: relative;
		display: grid;
		max-width: max-content;
		grid-auto-rows: minmax(7ch, max-content);
	}
	select {
		box-sizing: border-box;
		grid-row: 1;
		grid-column: 1;
		height: 100%;
		padding: var(--text-input-padding, 1.25rem);
		color: var(--text-input-color, black);
		background-color: var(--text-input-background, white);
		width: 100%;
		margin: 0;
		padding-bottom: 0.5rem;
		border-radius: var(--text-input-border-radius, 1rem);
		border: var(--text-input-border, none);
		max-height: max-content;
		min-height: 5ch;

		&:invalid {
			outline: var(--input-invalid-outline, intitial);
		}
		&:valid {
			outline: var(--input-valid-outline, initial);
		}

		&:not(:focus):hover ~ :global(.placeholder) {
			opacity: 0.2;
		}
	}

	/* Move the placeholder div when anything in the container receives focus or the select has a value */
	.select-container:focus-within > :global(.placeholder),
	select:active ~ :global(.placeholder),
	select.value:not(:focus) ~ :global(.placeholder) {
		translate: -3% -0.8rem 0;
		font-size: 0.75rem;
	}

	/* When the select isn't focused, but has a value, continue to fade and translate the placeholder div */
	select.value:not(:focus) ~ :global(.placeholder) {
		opacity: 0.4;
	}
</style>
