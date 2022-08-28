<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Fa } from 'svelte-fa';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons/index';
	import { tooltip, type TooltipParameters } from '../tooltip/tooltip-action.js';
	import type { DatalistOption } from './types.js';

	export let value = '';
	export let placeholder = '';
	export let type: 'text' | 'datalist' = 'text';
	export let title = '';
	export let required = false;
	export let pattern: RegExp | null = null;
	export let list = crypto?.randomUUID();
	export let show_confirm = true;
	export let options: DatalistOption[] = [];
	export let use_tooltip = false;
	export let tooltip_options: TooltipParameters = {
		title,
		disabled: !use_tooltip
	};
	export let custom_validity_function:
		| ((arg0: Event & { currentTarget: EventTarget & HTMLInputElement }) => void)
		| null = null;
	let input: HTMLInputElement;
	const dispatch = createEventDispatcher();

	function clearInput() {
		value = '';
		input.focus();
	}
	function confirm() {
		dispatch('confirm', value);
	}
	function passInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (custom_validity_function) custom_validity_function(e);
		dispatch('input', e.currentTarget.value);
	}
</script>

<div class="text-input-container" use:tooltip={{ ...tooltip_options }} {title}>
	{#if type === 'text'}
		<input
			type="text"
			bind:this={input}
			bind:value
			class:value
			{required}
			pattern={pattern?.source}
			on:input={(e) => passInput(e)}
		/>
		<div class="placeholder">
			{placeholder ?? ''}
		</div>
	{:else if type === 'datalist'}
		<input
			type="text"
			bind:this={input}
			bind:value
			class:value
			{required}
			pattern={pattern?.source}
			{list}
			on:input={(e) => passInput(e)}
		/>
		<div class="placeholder">
			{placeholder ?? ''}
		</div>
		<datalist id={list} tabindex="-1">
			{#each options as { value, label }}
				<option {value}>{label}</option>
			{/each}
		</datalist>
	{/if}
	<div class="btn-container">
		{#if show_confirm}
			<button class="confirm-btn" tabindex={value ? 0 : -1} class:value on:click={confirm}>
				<Fa icon={faCheck} color="inherit" />
			</button>
		{/if}
		{#if value}
			<button
				class="cancel-btn"
				class:no-confirm={!show_confirm}
				tabindex={value ? 0 : -1}
				class:value
				on:click={clearInput}
			>
				<Fa icon={faX} color="inherit" />
			</button>
		{/if}
	</div>
</div>

<style lang="scss">
	/* Avoid miscalculating size of padding/widths by including it in the box mesaurement */
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
	.placeholder,
	input[type='text'] {
		box-sizing: border-box;
		grid-row: 1;
		grid-column: 1;
		height: 100%;
		padding: var(--tex-input-padding, 1.25rem);
		color: var(--text, black);
	}
	input[type='text'] {
		--input-border-radius: 1rem;
		--button-padding-space: 2.5rem;
		box-sizing: border-box;
		background-color: var(--background, white);
		width: 100%;
		margin: 0;
		padding-bottom: 0.5rem;
		border-radius: var(--input-border-radius, 1rem);
		border: var(--input-border, none);
		max-height: max-content;
		min-height: 5ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* to make room for the cancel button */
		padding-right: var(--button-padding-space, 3rem);

		&:not(:focus):hover ~ .placeholder {
			opacity: 0.2;
		}
	}
	.placeholder {
		// position: absolute;
		inset: 0;
		transition: all ease-in-out 300ms;
		pointer-events: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		opacity: 0.6;
	}
	.btn-container {
		--button-margin: 0.15rem;
		--input-border-radius: 1rem;
		box-sizing: content-box;
		margin: 0;
		display: grid;
		gap: 0.25rem;
		place-items: center;
		grid-area: 1 / 1;
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
		aspect-ratio: 1 / 1;
		background-color: inherit;
		color: var(--text-input-color, inherit);
		border: var(--button-border, none);

		transition: color 300ms ease, opacity 300ms ease;
		opacity: 0;
		padding: var(--text-input-button-padding, calc(var(--max-width) / 3.5));
		margin-right: var(--button-margin-right, var(--button-margin));

		&:focus {
			accent-color: blue;
			outline: hsl(240, 63.8%, 72.9%) 3px solid;
		}

		&.value {
			opacity: 0.4;
			outline: 1px var(--button-outline, hsla(0, 0%, 0%, 0.2)) solid;
			&:hover,
			&:focus-visible {
				opacity: 1;
				outline: 1px var(--button-outline-hover-or-focus, hsla(0, 0%, 0%, 0.5)) solid;
			}
		}
	}
	.cancel-btn {
		border-radius: var(--input-border-radius, 1rem) 0 var(--input-border-radius, 1rem) 0;
		margin-bottom: var(--button-margin-bottom, var(--button-margin));
		&.no-confirm {
			box-sizing: border-box;
			border-radius: var(--input-border-radius);
			margin-bottom: 0;
			padding: calc(var(--max-width) / 3.5) calc(var(--max-width) / 3);
			height: 100%;
			justify-self: end;
			margin-right: 0;
			aspect-ratio: unset;
		}
	}
	.confirm-btn {
		border-radius: 0 var(--input-border-radius, 1rem) 0 var(--input-border-radius, 1rem);
		margin-top: var(--button-margin-top, var(--button-margin));
	}

	/* Move the placeholder div when anything in the container receives focus */
	.text-input-container:focus-within > .placeholder,
	input:active ~ .placeholder {
		transform: translate3d(-3%, -1em, 0);
		font-size: 0.55em;
	}

	/* When the input isn't focused, but has a value, continue to fade and translate the placeholder div */
	input.value:not(:focus) ~ .placeholder {
		transform: translate3d(-3%, -1em, 0);
		font-size: 0.55em;
		opacity: 0.4;
	}
</style>
