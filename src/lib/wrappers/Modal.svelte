<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types';
	import { fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let modal_foreground_styles = '';
	export let dialog_styles = '';
	/** Should the dialog initialize open by default? */
	export let dialog_starts_open = false;
	/** Is it an error modal? */
	export let is_error = false;
	/** The Svelte transition to use for animation the modal opening/closing */
	export let transition: SvelteTransition = scale;
	/** The transition parameters to use */
	export let transition_parameters: SvelteTransitionParams | null = { delay: 0 };

	let modal: HTMLDialogElement;
	let is_open = false;
	let use_scale = transition === scale;
	let use_fly = transition === fly;

	/** Exposed binding for closing the modal */
	export const close = async (): Promise<void> => {
		is_open = false;
		// Delay the actual close long enough for the class-based transition to play
		setTimeout(() => modal?.close(), 200);
	};
	/** Exposed binding for opening the modal */
	export const open = async (): Promise<void> => {
		modal?.showModal();
		is_open = true;
	};

	onMount(() => {
		if (dialog_starts_open && modal) {
			open();
		}
	});
</script>

<!-- transition:transition={transition_parameters} -->
<dialog
	bind:this={modal}
	class:open={is_open}
	class:is_error
	class:fly={use_fly}
	class:scale={use_scale}
	style={dialog_styles}
	on:click|capture|self={close}
	style:--transition-duration={`${transition_parameters?.duration ?? 400}ms`}
	style:--fly-x={`${transition_parameters?.x ?? -100}px`}
	style:--fly-y={`${transition_parameters?.y ?? 0}px`}
>
	{#if is_open}
		<div
			class="modal-foreground"
			style={modal_foreground_styles}
			transition:transition={transition_parameters}
		>
			<slot name="modal-content">slotted modal content goes here</slot>
		</div>
	{/if}
</dialog>

<style lang="scss">
	dialog {
		scrollbar-width: thin;
		position: fixed;
		border: none;
		border-radius: 25px;
		box-shadow: 0 0 10px var(--modal-box-shadow, var(--text, white));
		background-color: var(--background, inherit);
		color: var(--text, white);
		font-size: initial;
		margin: auto; // centers the dialog for bad browser user-agent stylesheets that default to top-left
		width: max-content;
		transition: transform var(--transition-duration) cubic-bezier(0.64, 0.31, 0.14, 1.57);
		pointer-events: none;
		&.open {
			pointer-events: initial;
		}
		&.scale {
			transform: scale3d(var(--scale, 0), var(--scale, 0), 1);
			&.open {
				transform: scale3d(var(--scale, 1), var(--scale, 1), 1);
			}
		}
		&.fly {
			transform: translate3d(var(--fly-x, 0), var(--fly-y, 5rem), 0);
			&.open {
				transform: translate3d(0, 0, 0);
			}
		}

		&::backdrop {
			background-color: hsla(0, 0%, 0%, 0.4);
			padding: 10rem;
			&.is_error {
				background-color: hsla(0, 41%, 58%, 0.4);
			}
		}
	}

	.modal-foreground {
		display: grid;
		grid-auto-rows: 1fr;
		grid-auto-columns: 1fr;
		place-items: center;
		padding: 1rem;
	}
	.is_error {
		background-color: pink;
		color: darkred;
	}
</style>
