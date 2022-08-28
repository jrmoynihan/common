```svelte
<script lang='ts'>
	let open_two: () => Promise<void>;
</script>

	<Button on:click={() => open_two()}>Toggle the &nbsp;<b>fly</b>&nbsp; modal!</Button>
	<Modal bind:open={open_two} transition={fly}>
		<p slot="modal-content">Hi again!</p>
	</Modal>
```