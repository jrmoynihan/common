<script lang="ts">
	export let url: URL;
	export let prefetch = true;
</script>

<mark>
	{#if prefetch}
		<link rel="prefetch" href={url.href} />
	{/if}
	<a href={url.href}><slot /></a></mark
>

<style lang="scss">
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
