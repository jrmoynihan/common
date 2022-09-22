```svelte example Wrapper="./ModalExample.svelte"
<script lang="ts">
	import Button from '$lib/buttons/Button.svelte';
	import Modal from '$lib/wrappers/Modal.svelte';
	import { fly } from 'svelte/transition';

	let open_two: () => Promise<void>;
</script>

<Button on:click={() => open_two()}>Toggle the <strong>fly</strong> modal!</Button>
<Modal bind:open={open_two} transition={fly}>
	<p slot="modal-content">Hi again!</p>
</Modal>
```
