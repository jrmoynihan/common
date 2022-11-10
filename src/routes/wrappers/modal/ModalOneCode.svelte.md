```svelte example Wrapper="./ModalExample.svelte"
<script lang="ts">
	import Button from '$buttons/Button.svelte';
	import Modal from '$wrappers/Modal.svelte';

	let open: () => Promise<void>;
</script>

<Button on:click={() => open()}>Toggle the default <b>scale</b> modal!</Button>
<Modal bind:open>
	<p slot="modal-content">Hello!</p>
</Modal>
```
