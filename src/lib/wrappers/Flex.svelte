<script context="module" lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
		direction?: 'row' | 'column';
		wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
		justify_content?:
			| 'normal'
			| 'start'
			| 'end'
			| 'left'
			| 'right'
			| 'center'
			| 'space-between'
			| 'space-around'
			| 'space-evenly';
		justify_self?:
			| 'auto'
			| 'normal'
			| 'stretch'
			| 'start'
			| 'end'
			| 'left'
			| 'right'
			| 'center'
			| 'baseline';
		align_content?:
			| 'normal'
			| 'start'
			| 'end'
			| 'center'
			| 'stretch'
			| 'baseline'
			| 'space-between'
			| 'space-around'
			| 'space-evenly';
		align_items?: 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
		align_self?: 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
		gap?: string;
		overflow?: 'hidden' | 'scroll' | 'auto' | 'visible';
		classes?: string;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		direction,
		wrap,
		justify_content,
		justify_self,
		align_content,
		align_items,
		align_self,
		gap,
		overflow,
		classes = '',
		children,
		...attributes
	}: FlexProps = $props();
</script>

<div
	class="_flex {classes}"
	style:--flex-direction={direction}
	style:--flex-wrap={wrap}
	style:--flex-justify-content={justify_content}
	style:--flex-justify-self={justify_self}
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
	@layer flex {
		._flex {
			display: flex;
			flex-direction: var(--flex-direction);
			flex-wrap: var(--flex-wrap);
			flex-basis: var(--flex-basis);
			justify-content: var(--flex-justify-content);
			justify-self: var(--flex-justify-self);
			align-content: var(--flex-align-content);
			align-items: var(--align-flex-items);
			align-self: var(--align-flex-self);
			gap: var(--flex-gap);
			overflow: var(--overflow);
		}
	}
</style>
