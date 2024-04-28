```svelte example Wrapper="./ModalExample.svelte"
<script lang="ts">
	import Button from '$buttons/Button.svelte';
	import ModalRunes from '$wrappers/ModalRunes.svelte';

	let open_modal: () => Promise<void>;
</script>

<!-- <Button on:click={() => open_modal()}>Toggle the default <b>scale</b> modal!</Button> -->
<button onclick={() => open_modal()}>Toggle the default <b>scale</b> modal!</button>
<ModalRunes bind:open_modal>
	<p>Hello!</p>
</Modal>
```
