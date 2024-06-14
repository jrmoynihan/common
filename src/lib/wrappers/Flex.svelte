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
	style:--direction={direction}
	style:--wrap={wrap}
	style:--justify-content={justify_content}
	style:--justify-self={justify_self}
	style:--align-content={align_content}
	style:--align-items={align_items}
	style:--align-self={align_self}
	style:--gap={gap}
	style:overflow
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	@layer flex {
		._flex {
			display: flex;
			flex-direction: var(--direction);
			flex-wrap: var(--wrap);
			flex-basis: var(--basis);
			justify-content: var(--justify-content);
			justify-self: var(--justify-self);
			align-content: var(--align-content);
			align-items: var(--align-items);
			align-self: var(--align-self);
			gap: var(--gap);
			order: var(--order);
			flex-grow: var(--grow);
			flex-shrink: var(--shrink);
		}
	}
</style>
