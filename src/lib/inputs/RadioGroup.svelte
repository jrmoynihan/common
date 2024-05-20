<script context='module' lang='ts'>
	import type { DynamicStyleParameters } from "$actions/dynamic-styles.svelte";

	import type { Snippet } from "svelte";

    type InputWithLabelProps = InputProps & InputLabelProps
    export interface RadioGroupProps<T> extends Omit<InputWithLabelProps, 'value' | 'children'>{
        items: ArrayLike<T> | Iterable<T>
        label_dynamic_styles?: DynamicStyleParameters
        input_dynamic_styles?: DynamicStyleParameters
        label_key?: string
        value_key?: string
        children?: Snippet<[T]>
    }
</script>
<script lang='ts' generics="T">
	import Input, { type InputProps } from "./Input.svelte";

	import InputLabel, { type InputLabelProps } from "./InputLabel.svelte";

    let {
        items = $bindable([]),
        group = $bindable(),
        label_dynamic_styles = $bindable(),
        input_dynamic_styles = $bindable(),
        label_key = 'label',
        value_key = 'value',
        children,
        ...input_attributes
    }  : RadioGroupProps<T> = $props();

</script>

{#snippet labeled_item(item)}
    {@const id = crypto.randomUUID()}
    {@const label = item instanceof Object ? item[label_key] : item}
    {@const value = item instanceof Object ? item[value_key] : item}
    <InputLabel text={label} {id}>
        <Input
            bind:group
            {id}
            {value}
            type='radio'
            data-checked={group === value}
            {...input_attributes}
        />
        {#if children}
            {@render children(item)}
        {/if}
    </InputLabel>
{/snippet}

{#each items as item}
    {@render labeled_item(item)}
{/each}

<style>
    @layer input_label{
        :global(label){
            transition: all 300ms ease;
            border-radius: var(--radio-group-border-radius, 0.25rem);
            padding: var(--radio-group-padding, 0.25rem);
        }
        :global(label:has(input[type="radio"][data-checked="true"])) {
            outline: 2px solid currentColor;
        }
    }

</style>