<script context="module" lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";

	export interface ExternalLinkProps extends HTMLAnchorAttributes {
		url: URL;
		prefetch?: boolean
	}
</script>
<script lang="ts">
	let {
		url,
		prefetch = true,
		children,
		...anchor_attributes
	} : ExternalLinkProps = $props();
</script>

<mark>
	{#if prefetch}
		<link rel="prefetch" href={url.href} />
	{/if}
	<a href={url.href} {...anchor_attributes}>
		{#if children}
			{@render children()}
		{/if}
	</a>
</mark>

<style>
	mark {
		background-color: transparent;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		&:has(code) {
			padding: 0;
		}
	}
	a {
		color: hsl(39, 100%, 50%);
		&:visited {
			color: hsl(15deg 100% 50%);
			@media (prefers-color-scheme: dark) {
				color: hsl(15deg 100% 70%);
			}
		}
	}
</style>
