<script lang='ts'>
	import { dynamicStyle, tooltip } from "$lib";
	import type { InputLabelProps } from "$lib/lib_types";
	import TransitionNativeRunes from "$wrappers/TransitionNative_Runes.svelte";
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
	class="text-input-container"
	use:dynamicStyle={dynamic_styles}
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
        label.text-input-container {
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