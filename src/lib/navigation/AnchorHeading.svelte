<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		text,
		type = 3,
		id = crypto?.randomUUID(),
		children
	}: {
		href?: string;
		text?: string;
		type?: 1 | 2 | 3 | 4 | 5 | 6;
		id?: string;
		children?: Snippet;
	} = $props();
</script>

{#snippet header(type)}
	{#if type === 1}
		<h1>
			{@render content()}
		</h1>
	{:else if type === 2}
		<h2>
			{@render content()}
		</h2>
	{:else if type === 3}
		<h3>
			{@render content()}
		</h3>
	{:else if type === 4}
		<h4>
			{@render content()}
		</h4>
	{:else if type === 5}
		<h5>
			{@render content()}
		</h5>
	{:else if type === 6}
		<h6>
			{@render content()}
		</h6>
	{/if}
{/snippet}

{#snippet content()}
	{#if children}
		{@render children()}
	{:else if text}
		{text}
	{/if}
{/snippet}

<a {id} {href}>
	{@render header(type)}
</a>
