<script lang="ts">
	import SetWritableContextExample from './SetWritableContextExample.svelte.md';
</script>

<section>
	<h3>setWritableContext</h3>
	<p>
		A function that that creates a Svelte <mark
			><a href="https://svelte.dev/docs#run-time-svelte-store-writable">writable store</a></mark
		>
		from the provided value, and assigns it to a
		<mark><a href="https://svelte.dev/docs#run-time-svelte-setcontext">context</a></mark> with the given
		key for descendant components to look up.
	</p>
	<p>
		<SetWritableContextExample />
	</p>
</section>

<style lang="scss">
	section {
		display: grid;
		justify-content: center;
	}
	mark {
		padding: 0.25rem;
		background-color: hsl(0, 20%, 5%);
		border-radius: 0.25rem;
		color: orange;
	}
	a {
		color: unset;
		&:visited {
			color: unset;
		}
	}
	p {
		max-width: 80ch;
		line-height: 1.2;
	}
</style>
