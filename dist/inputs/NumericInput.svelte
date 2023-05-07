<script>import { dynamicStyle } from '../actions/dynamic-styles.js';
import { tooltip } from '../actions/tooltip/tooltip.js';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Fa } from '@jrmoynihan/svelte-fa';
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';
import Placeholder from './Placeholder.svelte';
export let numeric_input = null;
export let value = 0;
export let min = 0;
export let max = Infinity;
export let step = 1;
export let placeholder = '';
export let name = '';
export let title = '';
export let id = '';
export let invalid_msg = '';
export let required = false;
export let is_valid = true;
export let show_spinner_buttons = true;
export let tooltip_options = null;
export let container_styles = '';
export let container_hover_styles = '';
export let container_focus_styles = '';
export let container_dynamic_styles = '';
export let input_styles = '';
export let input_hover_styles = '';
export let input_focus_styles = '';
/** Dynamically reactive styles to apply.  Invalid input styles automatically get appended to this. */
export let input_dynamic_stles = '';
/** Styles for when the input fails its validity test */
export let invalid_input_styles = 'color: salmon;';
export let pattern = null;
export let placeholder_props = {};
// TODO: add a prop for a custom validity function?
// TODO: add a SHIFT/CTRL modifier to allow for larger steps too
export let svelteTransition = fly;
export let transitionParams = {
    duration: 0
};
const dispatch = createEventDispatcher();
async function changed(value) {
    dispatch('change', value);
}
$: {
    value;
    is_valid = numeric_input?.checkValidity() ?? true;
}
</script>

<div
	use:tooltip={tooltip_options ? { ...tooltip_options } : { disabled: true, visible: false }}
	use:dynamicStyle={{
		styles: container_styles,
		hover_styles: container_hover_styles,
		focus_styles: container_focus_styles,
		dynamic_styles: container_dynamic_styles
	}}
	title={title ? title : placeholder}
	class="numeric-input-container"
	class:show-spinner-buttons={show_spinner_buttons}
	transition:svelteTransition={transitionParams}
>
	<Placeholder {...placeholder_props} />
	<input
		use:dynamicStyle={{
			styles: input_styles,
			hover_styles: input_hover_styles,
			focus_styles: input_focus_styles,
			dynamic_styles: `${input_dynamic_stles}; ${is_valid ? '' : invalid_input_styles}`
		}}
		bind:this={numeric_input}
		type="number"
		inputmode="numeric"
		{id}
		{name}
		{placeholder}
		{step}
		{min}
		{max}
		{pattern}
		{required}
		bind:value
		on:change={async (e) => changed(e.currentTarget.value)}
	/>
	{#if show_spinner_buttons}
		{@const max_num = Number(max)}
		{@const min_num = Number(min)}
		<button
			class="plus spinner"
			on:click={() => {
				if (Number(value) + Number(step) <= max_num) {
					value = Number(value) + Number(step);
				}
			}}
		>
			<Fa icon={faCaretUp} size={'xs'} />
		</button>
		<button
			class="minus spinner"
			on:click={() => {
				if (Number(value) - Number(step) >= min_num) {
					value = Number(value) - Number(step);
				}
			}}
		>
			<Fa icon={faCaretDown} size={'xs'} />
		</button>
	{/if}
</div>

<style>.numeric-input-container {
  display: grid;
  border-radius: 1rem;
  position: relative;
  width: var(--numeric-input-container-width, 100%);
  isolation: isolate;
}
.numeric-input-container.show-spinner-buttons {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.75rem);
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-template-areas: "input plus " "input minus ";
}

input {
  position: relative;
  grid-row: 1/span 2;
  grid-column: 1/span 2;
  appearance: textfield;
  -moz-appearance: textfield;
  text-align: center;
  padding: 1rem;
  padding-right: 1.75rem;
  border-radius: var(--input-border-radius, 1rem);
}
input::-webkit-inner-spin-button, input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
}

.spinner {
  z-index: var(--spinner-z-index, var(--above, 1));
  width: 1.75rem;
  height: 100%;
  background: var(--spinner-background);
  color: var(--spinner-color);
}

.plus {
  grid-area: plus;
  border-top-right-radius: inherit;
}

.minus {
  grid-area: minus;
  border-bottom-right-radius: inherit;
}</style>
