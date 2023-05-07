<script>import Button from '../buttons/Button.svelte';
import Modal from './Modal.svelte';
export let button_parameters = {};
export let modal_parameters = {};
//@ts-ignore
export let open = undefined;
//@ts-ignore
export let close = undefined;
</script>

<Button on:click={() => open()} {...button_parameters}>
	<svelte:fragment>
		<slot name="button-content" />
	</svelte:fragment>
</Button>
<Modal bind:open bind:close {...modal_parameters} on:closing on:opening>
	<svelte:fragment slot="modal-content">
		<slot name="modal-content" />
	</svelte:fragment>
</Modal>

<style></style>
