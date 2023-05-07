<script>import { dynamicStyle } from '../actions/dynamic-styles.js';
import { tooltip } from '../actions/tooltip/tooltip.js';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons/index';
import { Fa } from '@jrmoynihan/svelte-fa';
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import Placeholder from './Placeholder.svelte';
export let value = '';
export let id = crypto?.randomUUID() ?? '';
export let type = 'text';
export let title = '';
export let required = false;
export let pattern = null;
export let list = crypto?.randomUUID() ?? '';
export let show_confirm = true;
export let show_cancel = true;
export let options = [];
export let input_container_styles = '';
export let input_container_hover_styles = '';
export let input_container_focus_styles = '';
export let input_container_active_styles = '';
export let input_styles = '';
export let input_hover_styles = '';
export let input_focus_styles = '';
export let input_active_styles = '';
export let button_styles = '';
export let button_hover_styles = '';
export let button_focus_styles = '';
export let button_active_styles = '';
export let placeholder_props = {};
export let transition = fade;
export let transition_parameters = { duration: 0 };
export let tooltip_options = null;
export let custom_validity_function = null;
let input;
const dispatch = createEventDispatcher();
function clearInput() {
    value = '';
    input.focus();
}
function confirm() {
    dispatch('confirm', value);
}
function passInput(e) {
    if (custom_validity_function)
        custom_validity_function(e);
    dispatch('input', e.currentTarget.value);
}
// TODO: Use the Sanitizer API: https://web.dev/sanitizer/
</script>

<div
	class="text-input-container"
	use:dynamicStyle={{
		styles: input_container_styles,
		hover_styles: input_container_hover_styles,
		focus_styles: input_container_focus_styles,
		active_styles: input_container_active_styles
	}}
	use:tooltip={{ ...tooltip_options }}
	title={title ? title : placeholder_props?.placeholder}
	transition:transition={transition_parameters}
>
	{#if type === 'text'}
		<input
			use:dynamicStyle={{
				styles: input_styles,
				hover_styles: input_hover_styles,
				focus_styles: input_focus_styles,
				active_styles: input_active_styles
			}}
			{id}
			type="text"
			bind:this={input}
			bind:value
			class:value
			{required}
			pattern={pattern?.source}
			on:input={(e) => passInput(e)}
		/>
		{#key placeholder_props}
			<Placeholder {...placeholder_props} />
		{/key}
	{:else if type === 'datalist'}
		<input
			use:dynamicStyle={{
				styles: input_styles,
				hover_styles: input_hover_styles,
				focus_styles: input_focus_styles,
				active_styles: input_active_styles
			}}
			{id}
			role="combobox"
			aria-expanded={value !== ''}
			aria-controls={list}
			aria-autocomplete="list"
			aria-haspopup="listbox"
			aria-label={list}
			type="text"
			bind:this={input}
			bind:value
			class:value
			{required}
			pattern={pattern?.source}
			{list}
			on:input={(e) => passInput(e)}
		/>
		{#key placeholder_props}
			<Placeholder {...placeholder_props} />
		{/key}
		<datalist id={list} tabindex="-1">
			{#each options as { value, label }}
				<option {value}>{label}</option>
			{/each}
		</datalist>
	{/if}
	<div class="btn-container">
		{#if show_confirm}
			<button
				use:dynamicStyle={{
					styles: button_styles,
					hover_styles: button_hover_styles,
					focus_styles: button_focus_styles,
					active_styles: button_active_styles
				}}
				class="confirm-btn"
				tabindex={value ? 0 : -1}
				class:value
				on:click={confirm}
			>
				<Fa icon={faCheck} color="inherit" />
			</button>
		{/if}
		{#if value && show_cancel}
			<button
				use:dynamicStyle={{
					styles: button_styles,
					hover_styles: button_hover_styles,
					focus_styles: button_focus_styles,
					active_styles: button_active_styles
				}}
				class="cancel-btn"
				class:no-confirm={!show_confirm}
				tabindex={value ? 0 : -1}
				class:value
				style={button_styles}
				on:click={clearInput}
			>
				<Fa icon={faX} color="inherit" />
			</button>
		{/if}
	</div>
</div>

<style>/* Avoid miscalculating size of padding/widths by including it in the box mesaurement */
* {
  box-sizing: border-box;
}

.text-input-container {
  --text-input-padding: 1.25rem;
  position: relative;
  display: grid;
  max-width: max-content;
  grid-auto-rows: minmax(7ch, max-content);
}

input[type=text] {
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* to make room for the cancel button */
  padding-right: var(--text-input-button-padding-space, 2.5rem);
}
input[type=text]:invalid {
  outline: var(--input-invalid-outline, intitial);
}
input[type=text]:valid {
  outline: var(--input-valid-outline, initial);
}
input[type=text]:not(:focus):hover ~ :global(.placeholder) {
  opacity: 0.2;
}

.btn-container {
  --text-input-button-margin: 0.15rem;
  --input-border-radius: 1rem;
  box-sizing: content-box;
  margin: 0;
  display: grid;
  gap: 0.25rem;
  place-items: center;
  grid-area: 1/1;
  place-self: center end;
  height: 100%;
}

.cancel-btn,
.confirm-btn {
  --max-width: 1.75rem;
  box-sizing: content-box;
  display: grid;
  place-items: center;
  height: min(50%, var(--max-width));
  aspect-ratio: 1/1;
  background-color: inherit;
  color: var(--text-input-color, inherit);
  border: var(--text-input-button-border, none);
  transition: color 300ms ease, opacity 300ms ease;
  opacity: 0;
  padding: var(--text-input-button-padding, calc(var(--max-width) / 3.5));
  margin-right: var(--text-input-button-margin-right, var(--text-input-button-margin));
}
.cancel-btn:focus,
.confirm-btn:focus {
  accent-color: blue;
  outline: hsl(240, 63.8%, 72.9%) 3px solid;
}
.cancel-btn.value,
.confirm-btn.value {
  opacity: 0.4;
}
.cancel-btn.value:hover, .cancel-btn.value:focus-visible,
.confirm-btn.value:hover,
.confirm-btn.value:focus-visible {
  opacity: 1;
}
.cancel-btn.value:focus-visible,
.confirm-btn.value:focus-visible {
  outline: 1px var(--button-outline-hover-or-focus, hsla(0, 0%, 0%, 0.5)) solid;
}

.cancel-btn {
  border-radius: var(--text-input-border-radius, 1rem) 0 var(--text-input-border-radius, 1rem) 0;
  margin-bottom: var(--button-margin-bottom, var(--button-margin));
}
.cancel-btn.no-confirm {
  box-sizing: border-box;
  border-radius: var(--text-input-border-radius);
  margin-bottom: 0;
  padding: calc(var(--max-width) / 3.5) calc(var(--max-width) / 3);
  height: 100%;
  justify-self: end;
  margin-right: 0;
  aspect-ratio: unset;
}

.confirm-btn {
  border-radius: 0 var(--text-input-border-radius, 1rem) 0 var(--text-input-border-radius, 1rem);
  margin-top: var(--text-input-button-margin-top, var(--text-input-button-margin));
}

/* Move the placeholder div when anything in the container receives focus or the input has a value */
.text-input-container:focus-within > :global(.placeholder),
input:active ~ :global(.placeholder),
input.value:not(:focus) ~ :global(.placeholder) {
  translate: -0.5rem -0.8rem 0;
  font-size: 0.75rem;
}

/* When the input isn't focused, but has a value, continue to fade and translate the placeholder div */
input.value:not(:focus) ~ :global(.placeholder) {
  opacity: 0.4;
}</style>
