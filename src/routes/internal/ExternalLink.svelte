<script lang="ts">
	import { use_dark_theme } from '$routes/stores.js';
	export let url: URL;
	export let prefetch = true;
</script>

<mark>
	{#if prefetch}
		<link rel="prefetch" href={url.href} />
	{/if}
	<a href={url.href} class:dark={$use_dark_theme}><slot /></a></mark
>

<style lang="scss">
	:global(mark) {
		background-color: transparent;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		&:has(code) {
			padding: 0;
		}
	}
	:global(a) {
		color: hsl(39, 100%, 50%);
		&:visited {
			color: hsl(15deg 100% 50%);
			&.dark {
				color: hsl(15deg 100% 70%);
			}
		}
	}
</style>
