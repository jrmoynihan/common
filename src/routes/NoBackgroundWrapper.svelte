<script lang="ts">
	// the source of the example, if you want it
	// export let src;

	// all meta tags of the code block
	// export let meta;
</script>

<div class="example">
	<slot name="example" />
</div>
<div class="code">
	<pre class="language-svelte"><slot name="code" /></pre>
</div>

<style lang="scss">
	.example {
		display: grid;
		justify-content: center;
		background: inherit;
		border: none;
	}
	.code {
		margin: 0;
		display: grid;
		justify-self: center;
		justify-content: center;
		padding: 0 3rem;
		& > pre[class*='language-'] {
			margin: 0;
		}
	}
</style>
