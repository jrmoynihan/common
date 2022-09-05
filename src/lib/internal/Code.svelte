<script lang="ts">
	import { use_dark_theme } from '../../routes/stores';
</script>

<code class="my-code" class:dark={$use_dark_theme}>
	<slot />
</code>

<style lang="scss">
	:global(.my-code) {
		background-color: hsla(195, 81%, 24%, 60%);
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		font-family: 'Fira Code iScript', 'Fira Code', Menlo, Monaco, Consolas, 'Andale Mono',
			'Ubuntu Mono', 'Courier New', monospace;
		line-height: 1.5em;
		color: white;
		&.dark {
			background-color: hsla(195, 81%, 24%, 90%);
		}
	}
</style>
