<script lang="ts">
	import { tooltip } from '$lib/tooltip/tooltip-action';
</script>

<h1 use:tooltip={{ position: 'left' }}>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style lang="scss">
	h1 {
		margin: auto;
		max-width: max-content;
	}
</style>
