<!--TODO: Try page-transitions instead with shallow routing -->
<script lang="ts">
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import Dialog from '$wrappers/Dialog.svelte';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data } : { data: PageData } = $props();

	type Image = (typeof images)[0];
	const { images } = data;
	const [send, receive] = crossfade({ duration: 500 });

	let selected_image: Image | null = $state(null);
	let use_full_size = $state(false);
	let dialog: Dialog | undefined = $state();

	function showImage(image: Image) {
		selected_image = image;
		dialog?.open();
	}
	function next() {
		if (selected_image) {
			const index = images.findIndex((image) => image.uuid === selected_image?.uuid);
			if (index < images.length - 1) {
				showImage(images[index + 1]);
			} else {
				showImage(images[0]);
			}
		}
	}

	function previous() {
		if (selected_image) {
			const index = images.findIndex((image) => image.uuid === selected_image?.uuid);
			if (index > 0) {
				showImage(images[index - 1]);
			} else {
				showImage(images[images.length - 1]);
			}
		}
	}
</script>

{#snippet img({ alt, src, width = '100%', height = 'auto', classes })}
	<img class={classes} {alt} {src} {width} {height} />
{/snippet}

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'ArrowRight') {
			next();
		} else if (e.key === 'ArrowLeft') {
			previous();
		}
	}}
/>

<section>
	<h2>Gallery</h2>
	<label for="full-size-toggle">
		{use_full_size ? 'Full-Size Preview' : 'Scaled to Fit Preview'}
		<ToggleSwitch bind:checked={use_full_size} />
	</label>
	<div class="gallery">
		{#each images?.filter((image) => image.uuid !== selected_image?.uuid) as image (image.uuid)}
			<button
				onclick={() => showImage(image)}
				in:receive={{ key: image.uuid }}
				out:send={{ key: image.uuid }}
				animate:flip={{ duration: 500 }}
			>
				{@render img({
					path: image.path,
					alt: image.text,
					src: image.href,
					width: '100px',
					height: 'auto'
				})}
			</button>
		{/each}
	</div>

	<Dialog
		bind:this={dialog}
		onclose={() => {selected_image = null}}
		scale='none'
		slide='both'
		--dialog-background="transparent"
		--dialog-overflow="auto"
		--dialog-max-inline-size="auto"
		--dialog-max-block-size={use_full_size ? 'auto' : '90vh'}
		--dialog-width={use_full_size ? '100%' : 'max-content'}
		--dialog-place-self={use_full_size ? 'auto' : 'center'}
		--dialog-form-padding="0"
	>
		{#each images?.filter((image) => image.uuid === selected_image?.uuid) as { path, text, href, uuid } (uuid)}
			<button in:receive={{ key: uuid }} out:send={{ key: uuid }} animate:flip>
				{@render img({
					path,
					alt: text,
					src: href,
					width: use_full_size ? '100%' : 'auto',
					height: '100%',
					classes: use_full_size ? 'selected-image full-size' : 'selected-image'
				})}
			</button>
		{/each}
	</Dialog>
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
	.selected-image {
		box-sizing: border-box;
		max-width: 85dvw;
		max-height: 85dvh;
		&.full-size {
			max-width: 100%;
			max-height: unset;
		}
	}
	button {
		appearance: none;
		background-color: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		outline: none;
	}
</style>
