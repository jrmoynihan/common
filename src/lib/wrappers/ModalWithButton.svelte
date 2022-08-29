<script lang="ts" context="module">
	export interface ButtonProps extends ComponentProps<Button> {}
	export interface ModalProps extends ComponentProps<Modal> {}
</script>

<script lang="ts">
	import Button from '$lib/buttons/Button.svelte';
	import type { ComponentProps } from 'svelte/internal';
	import Modal from './Modal.svelte';

	export let button_parameters: ButtonProps = {};
	export let modal_parameters: ModalProps = {};
	//@ts-ignore
	export let open: () => Promise<void> = null;
	//@ts-ignore
	export let close: () => Promise<void> = null;
</script>

<Button on:click={() => open()} {...button_parameters}>
	<svelte:fragment>
		<slot name="button-content" />
	</svelte:fragment>
</Button>
<Modal bind:open bind:close {...modal_parameters}>
	<svelte:fragment slot="modal-content">
		<slot name="modal-content" />
	</svelte:fragment>
</Modal>

<style lang="scss">
</style>
