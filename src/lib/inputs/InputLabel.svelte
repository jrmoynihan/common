<script context="module" lang="ts">
	import type { DynamicStyleParameters } from "$actions/dynamic-styles.svelte";

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
        id?: string | null;
        /** The transition types to use for the invalid message.  Defaults to `[slide]` */
        invalid_msg_transition_types?: TransitionTypes[];
        /** A binding to the validity of the input.  Changing this triggers the visibility of the invalid message. */
        valid?: boolean;
        /** Props to pass to the tooltip action. */
        tooltip_props?: TooltipProps;
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

<script lang='ts'>
	import { dynamic_style, tooltip, type TooltipProps } from "$lib";
	import type { SvelteTransition, SvelteTransitionParams, TransitionTypes } from "$lib/lib_types";
	import TransitionNativeRunes from "$wrappers/TransitionNative_Runes.svelte";
	import type { Snippet } from "svelte";
	import type { HTMLLabelAttributes } from "svelte/elements";
	import { fade } from "svelte/transition";

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
        transition_parameters ={ duration: 0 },
        label_snippet = default_label,
        invalid_msg_snippet = default_invalid_snippet,
        transition = fade,
        ...label_attributes
    } :InputLabelProps = $props()

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
        {#if text && label_snippet}
            {@render label_snippet()}
        {/if}
    {/if}
    {#if children}
        {@render children()}
    {/if}
    {#if position === 'after'}
        {#if text && label_snippet}
            {@render label_snippet()}
        {/if}
    {/if}
    <TransitionNativeRunes types={invalid_msg_transition_types} visible={!valid}>
        <invalid>
            {@render invalid_msg_snippet()}
        </invalid>
    </TransitionNativeRunes>
</label>


<style lang='scss'>
    @layer input_label{
        label.label-container {
            --text-input-padding: 1.25em;
            position: relative;
            display: grid;
            max-width: max-content;
            gap: var(--label-gap, 0.35em);
            grid-auto-rows: minmax(0, max-content);
            grid-template-areas:
                'before'
                'input'
                'after';
            & > :global(:is(.before, .after)) {
                padding-block: 0.25em;
            }
            & > :gloal(.before) {
                grid-area: before;
            }
            & > :global(.after) {
                grid-area: after;
            }
            &:focus-within > :global(.placeholder) {
                scale: 0.75;
                translate: -3ch -25% 0;
            }
            & > :global(:where(input.value, select.value)) ~ :global(.placeholder) {
                scale: 0.75;
                translate: -3ch -25% 0;
            }
            &:hover:not(:focus) > :global(.placeholder) {
                opacity: 0.5;
            }
            &:focus-visible{
                outline: var(--input-outline, -webkit-focus-ring-color auto 1px);
            }
        }
    }
</style>