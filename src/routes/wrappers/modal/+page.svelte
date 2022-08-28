<script lang="ts">
	import Button from '$lib/buttons/Button.svelte';
	import Modal from '$lib/wrappers/Modal.svelte';
	import ModalWithButton from '$lib/wrappers/ModalWithButton.svelte';
	import { fly } from 'svelte/transition';
	import ModalOneCode from './ModalOneCode.svelte.md';
	import ModalTwoCode from './ModalTwoCode.svelte.md';
	import ModalWithButtonCode from './ModalWithButtonCode.svelte.md';

	let open: () => Promise<void>;
	let open_two: () => Promise<void>;
	let open_three: () => Promise<void>;
</script>

<section class="modals">
	<Button on:click={() => open()}>Toggle the default &nbsp;<b>scale</b>&nbsp; modal!</Button>
	<Modal bind:open>
		<p slot="modal-content">Hello!</p>
	</Modal>
	<ModalOneCode />
	<Button on:click={() => open_two()}>Toggle the &nbsp;<b>fly</b>&nbsp; modal!</Button>
	<Modal bind:open={open_two} transition={fly}>
		<p slot="modal-content">Hi again!</p>
	</Modal>
	<ModalTwoCode />
	<ModalWithButton
		bind:open={open_three}
		button_parameters={{
			text: `I'm a modal with a button, all-in-one.`,
			static_styles: 'padding: 2rem; background-color: darkcyan ;'
		}}
	>
		<svelte:fragment slot="modal-content">
			<p>Hello from the modal!</p>
		</svelte:fragment>
	</ModalWithButton>

	<ModalWithButtonCode />
</section>

<style lang="scss">
	.modals {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		align-items: center;
	}
</style>
