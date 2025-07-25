<script module lang="ts">
	export interface InputLabelProps extends HTMLLabelAttributes {
		/** A binding to the <label> element */
		label_element?: HTMLLabelElement;
		/** The text for the label */
		text?: string;
		/** The position of the label relative to the child element it labels. Defaults to `before`. */
		position?: 'before' | 'after';
		/** The text for the invalid message. */
		invalid_text?: string;
		/** The id of the element this labels with the `for` attribute. Defaults to `crypto.randomUUID()` */
		for_id?: string | null;
		/** A binding to the validity of the input.  Changing this triggers the visibility of the invalid message. */
		valid?: boolean;
		/** Parameters for the transition. */
		transition_parameters?: SvelteTransitionParams;
		invalid_msg_snippet?: Snippet;
		/** A snippet for the content of the label. Defaults to a simple <div> that contains the `text` with a class to position it. */
		label_snippet?: Snippet;
		/** The Svelte transition to use for the label */
		transition?: SvelteTransition;
	}
</script>

<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types';
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		children,
		position = 'before',
		label_element = $bindable(),
		text = $bindable(),
		invalid_text = $bindable(),
		valid = $bindable(),
		for_id = $bindable(),
		transition_parameters = { duration: 0 },
		label_snippet = default_label,
		invalid_msg_snippet = default_invalid_snippet,
		transition = fade,
		...label_attributes
	}: InputLabelProps = $props();
</script>

{#snippet default_invalid_snippet()}
	{invalid_text}
{/snippet}

{#snippet default_label()}
	<div class={position}>{text}</div>
{/snippet}

<label
	bind:this={label_element}
	for={for_id}
	transition:transition={transition_parameters}
	{...label_attributes}
	class={['_label-container', label_attributes.class]}
>
	{#if position === 'before'}
		{@render label_snippet?.()}
	{/if}

	{@render children?.()}

	{#if position === 'after'}
		{@render label_snippet?.()}
	{/if}
	<invalid>
		{@render invalid_msg_snippet()}
	</invalid>
</label>

<style>
	@layer common.input {
		@scope (label) {
			:global(input) {
				grid-area: input; /* Will overlap with the placeholder; */
			}
		}
	}

	@layer common.input.input_label {
		label._label-container {
			--default-input-label-hover-background-color: oklch(
				from var(--background) calc(l + 0.2) c h / 0.8
			);
			--text-input-padding: 1.25em;
			--default-input-label-border-radius: 1.5em;
			--default-input-label-padding-inline: max(
				0.25em,
				calc(var(--default-input-label-border-radius) / 2)
			);
			--default-input-label-padding-block: 0.5em;
			--input-border-radius: calc(
				var(--default-input-label-border-radius) -
					(var(--default-input-label-padding-inline) + var(--default-input-label-padding-block)) / 2
			);
			--invalid-transition-duration: 0.3s;
			position: relative;
			display: grid;
			gap: var(--label-gap, 0.35em);
			transition-property: grid-template-rows;
			overflow: hidden;
			transition-duration: var(--invalid-transition-duration);
			transition-timing-function: ease-in-out;
			transition-behavior: allow-discrete;
			grid-template-rows: repeat(3, minmax(0, max-content)) 0fr;
			/* Prevents overflow in some scenarios where the label is intrinsically sized in a flex container */
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas:
				'before'
				'input'
				'after'
				'invalid';
			padding-inline: var(--input-label-padding-inline, var(--default-input-label-padding-inline));
			padding-block: var(--input-label-padding-block, var(--default-input-label-padding-block));
			border-radius: var(--input-label-border-radius, var(--default-input-label-border-radius));
			cursor: var(--input-label-cursor, pointer);
			& > :global(:is(.before, .after)) {
				padding-block: 0.25em;
			}
			& > :global(.before) {
				grid-area: before;
			}
			& > :global(.after) {
				grid-area: after;
			}
			&:focus-within > :global(.placeholder) {
				scale: 0.75;
				translate: -12% -25% 0;
			}
			& > :global(:where(input.value, select.value)) ~ :global(.placeholder) {
				scale: 0.75;
				translate: -12% -25% 0;
			}
			&:hover:not(:focus) > :global(.placeholder) {
				opacity: 0.5;
			}
			&:hover {
				background-color: var(
					--input-label-hover-background-color,
					var(--default-input-label-hover-background-color)
				);
			}
			&:focus-visible {
				outline: var(--input-outline, -webkit-focus-ring-color auto 1px);
			}
			&:has(> input:focus-visible:not(:disabled)) {
				outline: var(--input-valid-outline, -webkit-focus-ring-color auto 1px);
				background-color: var(
					--input-label-focus-background-color,
					oklch(from var(--default-input-label-hover-background-color) l c h / 1)
				);
			}
			invalid {
				grid-area: invalid;
				opacity: 0;
				scale: 1 0;
				transform-origin: top;
				pointer-events: none;
				visibility: hidden;
				transition-property: opacity, pointer-events, visibility, scale;
				transition-duration: var(--invalid-transition-duration);
				transition-timing-function: ease-out;
				transition-behavior: allow-discrete;
				min-block-size: 0;
			}
			&:has(> :global(input:user-invalid)) {
				grid-template-rows: repeat(3, minmax(0, max-content)) 1fr;
				& > invalid {
					opacity: 1;
					scale: 1 1;
					pointer-events: auto;
					visibility: visible;
				}
			}
		}
	}
</style>
