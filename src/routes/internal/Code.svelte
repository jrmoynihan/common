<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export interface CodeProps extends HTMLAttributes<HTMLElement> {}
</script>

<script lang="ts">
	let { children }: CodeProps = $props();
</script>

<code class="my-code">
	{#if children}
		{@render children()}
	{/if}
</code>

<style>
	:global(.my-code) {
		background-color: hsla(195, 81%, 24%, 60%);
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		font-family:
			'Fira Code iScript', 'Fira Code', Menlo, Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono',
			'Courier New', monospace;
		font-size: 0.85em;
		line-height: 1.6em;
		color: white;
	}
	:global([data-theme='dark']) .my-code {
		background-color: hsla(195, 85%, 20%, 90%);
	}
</style>
