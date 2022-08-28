<script lang="ts">
	import { imageCrossfade } from './image-crossfade';
	import { flip } from 'svelte/animate';
	import type { PageData } from './$types';

	export let data: PageData;
	const { images } = data;
	const [send, receive] = imageCrossfade;
	let image_id: string | null = null;
	let dialog: HTMLDialogElement;
</script>

<section>
	<h2>Gallery</h2>
	<div class="gallery">
		{#each images?.filter((image) => image.uuid !== image_id) as { path, text, href, uuid } (uuid)}
			<img
				on:click={() => {
					image_id = uuid;
					dialog.showModal();
				}}
				class="image"
				alt={text}
				src={href}
				width="100px"
				height="auto"
				in:receive={{ key: uuid }}
				out:send={{ key: uuid }}
			/>
			<!-- animate:flip={{ duration: 500 }} -->
		{/each}
	</div>

	<dialog
		bind:this={dialog}
		on:click={() => {
			image_id = null;
			// Delay the closing of the dialog until the crossfade duration (default: 800ms) finishes
			setTimeout(() => {
				dialog.close();
			}, 300);
		}}
	>
		{#each images?.filter((image) => image.uuid === image_id) as { path, text, href, uuid } (uuid)}
			<img
				on:click
				class="selected-image"
				alt={text}
				src={href}
				width="100%"
				height="auto"
				in:receive={{ key: uuid }}
				out:send={{ key: uuid }}
				animate:flip
			/>
		{/each}
	</dialog>
</section>

<style lang="scss">
	h2 {
		margin-inline: auto;
	}
	.gallery {
		display: flex;
		flex-wrap: wrap;
		place-items: center;
		place-content: center;
		justify-self: center;
		gap: 0.5rem;
		overflow: auto;
		max-width: 100dvw;
		max-height: 50dvh;
	}
	section {
		display: grid;
		grid-auto-rows: max-content;
		grid-template-columns: 1fr;
	}
	dialog {
		display: none;
		position: fixed;
		inset: 0;
		width: 100vw;
		height: calc(100vh - 1rem);
		max-width: 100vw;
		max-height: calc(100vh - 1rem);
		background-color: hsla(0, 0%, 0%, 70%);
		&[open] {
			display: grid;
			place-content: center;
			place-items: center;
		}
		&::backdrop {
			background-color: hsla(0, 0%, 0%, 20%);
		}
	}
	.selected-image {
		box-sizing: border-box;
		width: 100%;
		height: auto;
	}
</style>
