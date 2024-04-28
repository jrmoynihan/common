<script lang=ts context=module>
	export interface SelectProps {
		value?: unknown;
		select_attributes? : HTMLSelectAttributes;
		/** A snippet of HTML for the `<optgroup>` of the `<select>`.*/
		group_snippet?: Snippet<[any]>,
		/** A snippet for how to render a single `<option>` in the `<select>`.*/
		option_snippet?: Snippet<[any]>,
		options?: SelectOptionList,
		dynamic_select_styles?: DynamicStyleParameters;
		input_label_props: ComponentProps<InputLabel>;
		label?: Snippet<[any]>;
		placeholder_props?: ComponentProps<Placeholder>;
	}
</script>

<script lang="ts">
	import { dynamicStyle, type DynamicStyleParameters } from '$actions/dynamic-styles.js';
	import type { SelectOption, SelectOptionGroup, SelectOptionList } from '$lib/lib_types';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import Placeholder from './Placeholder.svelte';
	
	let {
		value = $bindable(),
		select_attributes,
		options = [],
		option_snippet = option,
		group_snippet = group,
		dynamic_select_styles,
		input_label_props,
		placeholder_props = {},
		
	} : SelectProps = $props();

	// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

{#snippet option({value, disabled, text}: SelectOption)}
	<option {value} {disabled}>
		{text ?? ''}
	</option>
{/snippet}

{#snippet group(o: SelectOptionGroup | SelectOption)}
	{#if 'options' in o}
		<optgroup label={o.label}>
			{#each o.options as suboption}
				{@render group(suboption)}
			{/each}
		</optgroup>
	{:else}
		{@render option(o)}
	{/if}
{/snippet}

<InputLabel {...input_label_props}>
	<select
	use:dynamicStyle={dynamic_select_styles}
	bind:value
		class="select"
		class:value
		id={crypto?.randomUUID()}
		{...select_attributes}
	>	
		{#if group_snippet}
			{#each options as opt}
				{@render group_snippet(opt)}
			{/each}
		{:else if option_snippet}
			{#each options as opt}
				{@render option_snippet(opt)}
			{/each}
		{/if}
	</select>
	<Placeholder {...placeholder_props} />
</InputLabel>

<style lang="scss">
	/* Avoid miscalculating size of padding/widths by including it in the box mesaurement */
	* {
		box-sizing: border-box;
	}
	select {
		box-sizing: border-box;
		grid-area: input;
		padding: var(--text-input-padding, 1.25em);
		color: var(--text-input-color, inherit);
		background-color: var(--text-input-background, revert);
		width: 100%;
		margin: 0;
		padding-bottom: 0.5rem;
		border-radius: var(--text-input-border-radius, 1rem);
		border: var(--text-input-border, inset);
		min-height: 3ch;
		// -webkit-appearance: initial;
		// height: 100%;
		// max-height: max-content;  /** Causes issues on Safari */
		
		// Different rules that only get applied to Safari:
		
		background-color: var(--text-input-background, revert);

		&:focus-visible{
			outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
		}

		&:invalid:not(:focus) {
			outline: var(--input-invalid-outline, initial);
		}
	}

</style>
