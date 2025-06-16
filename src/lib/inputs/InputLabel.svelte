<script module lang="ts">
	import type { DynamicStyleParameters } from '$actions/dynamic-styles.svelte';

	export interface InputLabelProps<T> extends HTMLLabelAttributes {
		/** A binding to the <label> element */
		label_element?: HTMLLabelElement;
		/** The text for the label */
		text?: string;
		/** The position of the label relative to the child element it labels. Defaults to `before`. */
		position?: 'before' | 'after';
		/** The text for the invalid message. */
		invalid_text?: string;
		/** The id of the element this labels with the `for` attribute. Defaults to `crypto.randomUUID()` */
		id?: string | null;
		/** The transition types to use for the invalid message.  Defaults to `[slide]` */
		invalid_msg_transition_types?: TransitionTypes[];
		/** A binding to the validity of the input.  Changing this triggers the visibility of the invalid message. */
		valid?: boolean;
		/** Props to pass to the tooltip action. */
		tooltip_props?: TooltipProps<T>;
		/** Styles to apply to the label, including hover/focus/active styles. */
		dynamic_styles?: DynamicStyleParameters;
		/** Parameters for the transition. */
		transition_parameters?: SvelteTransitionParams;
		invalid_msg_snippet?: Snippet;
		/** A snippet for the content of the label. Defaults to a simple <div> that contains the `text` with a class to position it. */
		label_snippet?: Snippet;
		/** The Svelte transition to use for the label */
		transition?: SvelteTransition;
	}
</script>

<script lang="ts" generics="T">
	import { dynamic_style, tooltip, type TooltipProps } from '$lib';
	import type { SvelteTransition, SvelteTransitionParams, TransitionTypes } from '$lib/lib_types';
	import TransitionNativeRunes from '$wrappers/TransitionNative_Runes.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		children,
		dynamic_styles,
		position = 'before',
		label_element = $bindable(),
		text = $bindable(),
		invalid_text = $bindable(),
		valid = $bindable(true),
		id = $bindable(crypto?.randomUUID()),
		invalid_msg_transition_types = ['slide'],
		tooltip_props: tooltip_options = {
			visible: false,
			disabled: true
		},
		transition_parameters = { duration: 0 },
		label_snippet = default_label,
		invalid_msg_snippet = default_invalid_snippet,
		transition = fade,
		...label_attributes
	}: InputLabelProps<T> = $props();
</script>

{#snippet default_invalid_snippet()}
	{invalid_text}
{/snippet}

{#snippet default_label()}
	<div class={position}>{text}</div>
{/snippet}

<label
	bind:this={label_element}
	for={id}
	class="label-container"
	use:dynamic_style={dynamic_styles}
	use:tooltip={{ ...tooltip_options }}
	transition:transition={transition_parameters}
	{...label_attributes}
>
	{#if position === 'before'}
		{@render label_snippet?.()}
	{/if}

	{@render children?.()}

	{#if position === 'after'}
		{@render label_snippet?.()}
	{/if}
	<TransitionNativeRunes types={invalid_msg_transition_types} visible={!valid}>
		<invalid>
			{@render invalid_msg_snippet()}
		</invalid>
	</TransitionNativeRunes>
</label>

<style lang="scss">
	@layer input_label {
		label.label-container {
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
			position: relative;
			display: grid;
			gap: var(--label-gap, 0.35em);
			grid-auto-rows: minmax(0, max-content);
			grid-template-areas:
				'before'
				'input'
				'after';
			container-type: inline-size;
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
				translate: -3ch -25% 0;
				translate: -13cqw -1.5cqh 0;
			}
			& > :global(:where(input.value, select.value)) ~ :global(.placeholder) {
				scale: 0.75;
				translate: -3ch -25% 0;
				translate: -13cqw -1.5cqh 0;
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
		}
	}
</style>
