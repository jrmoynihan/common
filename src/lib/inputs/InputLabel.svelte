<script lang='ts'>
	import { dynamicStyle, tooltip } from "$lib";
	import type { InputLabelProps } from "$lib/lib_types";
	import TransitionNativeRunes from "$wrappers/TransitionNative_Runes.svelte";
	import { fade } from "svelte/transition";

    let {
        children,
        label_attributes,
        label_element = $bindable(),
        label_text = $bindable(),
        label_position = 'before',
        label_snippet = default_label,
        id = crypto?.randomUUID(),
        invalid_text = $bindable(),
        invalid_msg_transition_types = ['slide'],
        invalid_msg_snippet = default_invalid_snippet,
        valid = $bindable(true),
        tooltip_options = {
            visible: false,
            disabled: true
        },
        dynamic_styles,
        placeholder_props = {},
        title,
        transition = fade,
        transition_parameters ={ duration: 0 },
    } :InputLabelProps = $props()

</script>

{#snippet default_invalid_snippet(message)}
	{message}
{/snippet}
{#snippet default_label({label_text, label_position})}
	<div class={label_position}>{label_text}</div>
{/snippet}

<label
    bind:this={label_element}
	for={id}
	class="text-input-container"
	use:dynamicStyle={dynamic_styles}
	use:tooltip={{ ...tooltip_options }}
	title={title ? title : placeholder_props?.text}
	transition:transition={transition_parameters}
    {...label_attributes}
>
    {#if label_position === 'before'}
        {#if label_text && label_snippet}
            {@const label_props = { label_text, label_position }}
            {@render label_snippet(label_props)}
        {/if}
    {/if}
    {#if children}
        {@render children({placeholder_props})}
    {/if}
    {#if label_position === 'after'}
        {#if label_text && label_snippet}
            {@render label_snippet({label_text, label_position})}
        {/if}
    {/if}
    <TransitionNativeRunes types={invalid_msg_transition_types} visible={!valid}>
        <invalid>
            {@render invalid_msg_snippet(invalid_text)}
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
            & > :is(.before, .after) {
                padding-block: 0.25em;
            }
            & > .before {
                grid-area: before;
            }
            & > .after {
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