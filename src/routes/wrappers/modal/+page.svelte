<script lang="ts">
	import ModalOneCode from './ModalOneCode.svelte.md';
	import ModalTwoCode from './ModalTwoCode.svelte.md';
	import ModalWithButtonCode from './ModalWithButtonCode.svelte.md';
</script>

<section class="modals">
	<ModalOneCode />
	<ModalTwoCode />
	<ModalWithButtonCode />
</section>

<style lang="scss">
	.modals {
		display: grid;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		justify-self: center;
		margin: 2rem;
	}
</style>
