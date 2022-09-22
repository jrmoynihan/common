```svelte example Wrapper="./ModalExample.svelte"
<script lang="ts">
	import ModalWithButton from '$lib/wrappers/ModalWithButton.svelte';

	let open: () => Promise<void>;
</script>

<ModalWithButton
	bind:open
	button_parameters={{
		text: `I'm a modal with a button, all-in-one.`,
		styles: 'padding: 2rem; background-color: darkcyan ;'
	}}
>
	<svelte:fragment slot="modal-content">
		<p>Hello from the modal!</p>
	</svelte:fragment>
</ModalWithButton>
```
