<script lang="ts">
</script>

<h1>
	<a href="/" sveltekit:prefetch class="cool-text">The Commons</a>
</h1>
<section>
	<a href="/tooltips" sveltekit:prefetch class="link">Tooltips</a>
	<a href="/inputs" sveltekit:prefetch class="link">Inputs</a>
</section>
<main>
	<slot />
</main>

<style lang="scss">
	:root {
		font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', -apple-system,
			BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background-color: hsl(195, 61%, 14%);
		color: white;
		--tooltip-color: black;
		--tooltip-font-weight: 400;
		--tooltip-font-size: 12px;
	}
	h1 {
		margin: 2rem auto;
		max-width: max-content;
		font-style: italic;
		font-weight: 800;
		font-size: 5vh;
		font-family: 'Fira Code iScript';
		text-align: center;
	}
	main {
		display: flex;
		place-items: center;
	}
	.cool-text {
		display: inline-flex;
		color: orange;
		text-decoration: underline;
		transition: background-color 0.2s ease-in-out;
		padding: 0.5rem;
		border-radius: 1rem;
		&:hover,
		&:focus-visible {
			background-color: hsl(195, 61%, 34%);
		}
	}
	section {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 2rem auto;
		max-width: max-content;
		gap: 1rem;
	}
	.link {
		text-decoration: none;
		font-size: 1.5rem;
		padding: 1rem;
		color: white;
		border-radius: 2rem;
		background-color: hsl(195, 61%, 34%);
		transition: background-color 0.2s ease-in-out;
		&:hover,
		&:focus-visible {
			background-color: hsl(195, 61%, 44%);
		}
	}
</style>
