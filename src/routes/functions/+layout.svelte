<script lang="ts">
	let {
		children
	} = $props();
</script>

<section class="functions-page-layout">
	{@render children()}
</section>

<style lang="scss">
	.functions-page-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		margin: 1rem;
		gap: 1rem;
	}
</style>
