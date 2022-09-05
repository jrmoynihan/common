<script lang="ts">
	import { tooltip } from '$lib';
	import Button from '$lib/buttons/Button.svelte';
	import Modal from '$lib/wrappers/Modal.svelte';
	import ModalWithButton from '$lib/wrappers/ModalWithButton.svelte';
	import { fly } from 'svelte/transition';
	import ModalOneCode from './ModalOneCode.svelte.md';
	import ModalTwoCode from './ModalTwoCode.svelte.md';
	import ModalWithButtonCode from './ModalWithButtonCode.svelte.md';

	let open_one: () => Promise<void>;
	let open_two: () => Promise<void>;
	let open: () => Promise<void>;
	let offsetWidth: number;
</script>

<section class="modals">
	<div class="demo">
		<h3>Modal With <em>scale</em> transition</h3>
		<Button on:click={() => open_one()}>Toggle the default &nbsp;<b>scale</b>&nbsp; modal!</Button>
		<Modal bind:open={open_one}>
			<p slot="modal-content">Hello!</p>
		</Modal>
	</div>
	<ModalOneCode />
	<div class="demo">
		<h3>Modal With <em>fly</em> transition</h3>
		<Button on:click={() => open_two()}>Toggle the &nbsp;<b>fly</b>&nbsp; modal!</Button>
		<Modal bind:open={open_two} transition={fly}>
			<p slot="modal-content">Hi again!</p>
		</Modal>
	</div>
	<ModalTwoCode />
	<div class="demo">
		<h3>Combined Button <em>With</em> Modal</h3>
		<ModalWithButton
			bind:open
			button_parameters={{
				text: `I'm a modal with a styled button, all-in-one.`,
				static_styles: 'padding: 2rem; background-color: darkcyan ;'
			}}
		>
			<svelte:fragment slot="modal-content">
				<p
					use:tooltip={{
						title: 'I need to be fixed when dialog tooltips are made immediately visible!',
						keep_visible: true,
						visibility_delay: 2000,
						position: 'top'
					}}
					bind:offsetWidth
				>
					Hello from the modal!
				</p>
			</svelte:fragment>
		</ModalWithButton>
	</div>
	<ModalWithButtonCode />
</section>

<style lang="scss">
	.modals {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		justify-self: center;
		margin-block: 2rem;
	}
	.demo {
		display: grid;
		gap: 1rem;
		grid-template-rows: repeat(2, minmax(0, 1fr));
		justify-content: center;
		justify-items: center;
		position: relative;
	}
</style>
