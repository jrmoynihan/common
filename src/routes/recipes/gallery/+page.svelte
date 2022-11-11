<script lang="ts">
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/recipes/gallery/$types.js';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';

	export let data: PageData;
	const { images } = data;
	const [send, receive] = crossfade({ duration: 500 });
	let image_id: string | null = null;
	let dialog: HTMLDialogElement;
	let use_full_size = false;
</script>

<section>
	<h2>Gallery</h2>
	<label for="full-size-toggle">
		{use_full_size ? 'Full-Size Preview' : 'Scaled to Fit Preview'}
		<ToggleSwitch bind:checked={use_full_size} />
	</label>
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
				animate:flip={{ duration: 500 }}
			/>
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
				class:full-size={use_full_size}
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
		width: auto;
		height: 100%;
		&.full-size {
			width: 100%;
			height: auto;
		}
	}
</style>
