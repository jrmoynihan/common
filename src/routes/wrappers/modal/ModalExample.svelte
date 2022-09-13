<script lang="ts">
	// the source of the example, if you want it
	// export let src;

	// all meta tags of the code block
	// export let meta;
</script>

<div class="two-columns">
	<div class="example">
		<slot name="example" />
	</div>
	<div class="code">
		<pre class="language-svelte"><slot name="code" /></pre>
	</div>
</div>

<style lang="scss">
	.two-columns {
		display: grid;
		grid-template-columns: minmax(0, 35%) minmax(0, 65%);
		align-items: center;
		gap: 1rem;
	}
	.example {
		display: grid;
		justify-content: center;
		background: inherit;
		border: none;
	}
	.code {
		margin: 0;
		& > pre[class*='language-'] {
			margin: 0;
		}
	}
</style>
