<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface FlexItemProps extends HTMLAttributes<HTMLDivElement> {
		order?: number;
		grow?: number;
		shrink?: number;
		basis?: string;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let { order, grow = 1, shrink = 1, basis, children, ...attributes }: FlexItemProps = $props();
</script>

<div
	class={['_flex-item', attributes.class]}
	style:--order={order}
	style:--grow={grow}
	style:--shrink={shrink}
	style:--basis={basis}
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	@layer common.flex.flex_item {
		._flex-item {
			order: var(--order);
			flex-grow: var(--grow);
			flex-shrink: var(--shrink);
			flex-basis: var(--basis);
		}
	}
</style>
