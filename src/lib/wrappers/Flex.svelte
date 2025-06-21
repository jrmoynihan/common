<script module lang="ts">
	import type { align_self_options, overflow_options } from '$functions/helpers.svelte';
	import type {
		align_content_options,
		align_items_options,
		direction_options,
		justify_content_options,
		wrap_options
	} from '$lib';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
		direction?: keyof typeof direction_options;
		wrap?: keyof typeof wrap_options;
		justify_content?: keyof typeof justify_content_options;
		align_content?: keyof typeof align_content_options;
		align_items?: keyof typeof align_items_options;
		align_self?: keyof typeof align_self_options;
		overflow?: keyof typeof overflow_options;
		gap?: string;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		direction,
		wrap,
		justify_content,
		align_content,
		align_items,
		align_self,
		gap,
		overflow,
		children,
		...attributes
	}: FlexProps = $props();
</script>

<div
	class={['_flex', attributes.class]}
	style:--flex-direction={direction}
	style:--flex-wrap={wrap}
	style:--flex-justify-content={justify_content}
	style:--flex-align-content={align_content}
	style:--flex-align-items={align_items}
	style:--flex-align-self={align_self}
	style:--flex-gap={gap}
	style:--overflow={overflow}
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	@layer common.flex {
		._flex {
			display: flex;
			flex-direction: var(--flex-direction, auto);
			flex-wrap: var(--flex-wrap, nowrap);
			justify-content: var(--flex-justify-content, normal);
			align-content: var(--flex-align-content);
			align-items: var(--align-flex-items);
			align-self: var(--align-flex-self);
			gap: var(--flex-gap);
			overflow: var(--overflow);
		}
	}
</style>
