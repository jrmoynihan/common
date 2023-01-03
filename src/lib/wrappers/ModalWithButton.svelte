<script lang="ts">
	import Button from '$buttons/Button.svelte';
	import type { ComponentProps } from 'svelte/internal';
	import Modal from './Modal.svelte';

	export let button_parameters: ComponentProps<Button> = {};
	export let modal_parameters: ComponentProps<Modal> = {};
	//@ts-ignore
	export let open: () => Promise<void> = undefined;
	//@ts-ignore
	export let close: () => Promise<void> = undefined;
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

<style lang="scss">
</style>
