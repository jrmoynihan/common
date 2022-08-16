<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons/index.es';
	import { tooltip, type TooltipParameters } from '@jrmoynihan/common';

	export let value = '';
	export let placeholder = '';
	export let type: 'text' | 'datalist' = 'text';
	export let title = '';
	export let required = false;
	export let pattern: RegExp = null;
	export let list = '';
	export let show_confirm = true;
	export let options: { value: unknown; label: string }[] = [];
	export let use_tooltip = false;
	export let tooltip_options: TooltipParameters = { position: 'top' };
	export let custom_validity_function: (
		e: Event & { currentTarget: EventTarget & HTMLInputElement }
	) => boolean = null;
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

<div
	class="text-input-container"
	{title}
	use:tooltip={use_tooltip ? { title, ...tooltip_options } : {}}>
	{#if type === 'text'}
		<input
			type="text"
			bind:this={input}
			bind:value
			class:value
			{required}
			pattern={pattern?.source}
			on:input={(e) => passInput(e)} />
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
			on:input={(e) => passInput(e)} />
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
				<Fa icon={faCheck} />
			</button>
		{/if}
		{#if value}
			<button
				class="cancel-btn"
				class:no-confirm={!show_confirm}
				tabindex={value ? 0 : -1}
				class:value
				on:click={clearInput}>
				<Fa icon={faX} />
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
		--btn-padding-space: 2.5rem;
		box-sizing: border-box;
		background-color: var(--background, white);
		width: 100%;
		margin: 0;
		padding-bottom: 0.5rem;
		border-radius: var(--input-border-radius, 1rem);
		max-height: max-content;
		min-height: 5ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* to make room for the cancel button */
		padding-right: var(--btn-padding-space, 3rem);

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
		--btn-margin: 0.15rem;
		--input-border-radius: 1rem;
		box-sizing: content-box;
		margin: 0;
		display: grid;
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
		color: var(--text);
		// border: hsla(var(--text-value), 0.4) 1px solid;
		transition: color 300ms ease, opacity 300ms ease;
		opacity: 0;
		padding: calc(var(--max-width) / 3.5);
		margin-right: var(--btn-margin-right, var(--btn-margin));

		&:focus {
			accent-color: blue;
			outline: hsl(240, 63.8%, 72.9%) 3px solid;
		}

		&.value {
			opacity: 0.6;
		}

		&.value:hover {
			opacity: 1;
			transform: scale(1.02);
		}
		&.value:active {
			transform: scale(0.97);
		}
	}
	.cancel-btn {
		border-radius: var(--input-border-radius, 1rem) 0 var(--input-border-radius, 1rem) 0;
		margin-bottom: var(--btn-margin-bottom, var(--btn-margin));
		&.no-confirm {
			border-radius: var(--input-border-radius);
			margin-bottom: 0;
			padding: calc(var(--max-width) / 3.5) calc(var(--max-width) / 7);
		}
	}
	.confirm-btn {
		border-radius: 0 var(--input-border-radius, 1rem) 0 var(--input-border-radius, 1rem);
		margin-top: var(--btn-margin-top, var(--btn-margin));
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
