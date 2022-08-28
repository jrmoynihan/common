```svelte
<script lang='ts'>
	let open: () => Promise<void>;
</script>

	<Button on:click={() => open()}>Toggle the default <b>scale</b> modal!</Button>
	<Modal bind:open>
		<p slot="modal-content">Hello!</p>
	</Modal>
```