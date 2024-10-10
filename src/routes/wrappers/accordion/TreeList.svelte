<script lang="ts">
	import type { Snippet } from 'svelte';
	import TreeItem from './TreeItem.svelte';

	let {
		node_to,
		items,
		children
	}: {
		node_to: string;
		items?: { is_node: string; children: Snippet }[];
		children?: Snippet;
	} = $props();
</script>

{#snippet list_item(is_node: string, children: Snippet)}
	<TreeItem {children} {is_node} />
{/snippet}

<ul class="tree" style:--to={node_to}>
	{#if children && items && items.length > 0}
		{@render children()}
		{#each items as item}
			{@render list_item(item.is_node, item.children)}
		{/each}
	{:else if items && items.length > 0}
		{#each items as item}
			{@render list_item(item.is_node, item.children)}
		{/each}
	{:else if children}
		{@render children()}
	{/if}
</ul>

<style lang="scss">
	.tree {
		all: unset;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		--offset: 4px;
		--lh: 1.2em;
		margin-bottom: 2px;
		transition: all 300ms ease;
	}
</style>
