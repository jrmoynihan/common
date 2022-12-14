<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';

	export let modal_foreground_styles = '';
	export let dialog_styles = '';
	/** Should the dialog initialize open by default? */
	export let dialog_starts_open = false;
	/** Is it an error modal? */
	export let is_error = false;
	/** The Svelte transition to use for animation the modal opening/closing */
	export let transition: SvelteTransition = scale;
	/** The transition parameters to use */
	export let transition_parameters: SvelteTransitionParams = { delay: 0 };

	let modal: HTMLDialogElement;
	let is_open = false;
	let use_scale = transition === scale;
	let use_fly = transition === fly;
	let dispatch = createEventDispatcher();

	/** Exposed binding for closing the modal */
	export const close = async (): Promise<void> => {
		dispatch('closing');
		is_open = false;
		// Delay the actual close long enough for the class-based transition to play
		setTimeout(() => modal?.close(), 200);
	};
	/** Exposed binding for opening the modal */
	export const open = async (): Promise<void> => {
		dispatch('opening');
		modal?.showModal();
		is_open = true;
	};

	onMount(() => {
		if (dialog_starts_open && modal) {
			open();
		}
	});
</script>

<dialog
	bind:this={modal}
	class:open={is_open}
	class:is_error
	class:fly={use_fly}
	class:scale={use_scale}
	style={dialog_styles}
	on:keypress
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
		overflow: var(
			--modal-overflow
		); // added for tooltips to escape the edges, but should be silent/inactive usually
		scrollbar-width: thin;
		position: fixed;
		border: none;
		border-radius: 25px;
		box-shadow: 0 0 10px var(--modal-box-shadow, var(--text, white));
		background: var(--modal-background, var(--background, inherit));
		color: var(--modal-color, var(--text, inherit));
		font-size: initial;
		margin: auto; // centers the dialog for bad browser user-agent stylesheets that default to top-left
		width: max-content;
		transition: var(
			--modal-transition,
			all var(--transition-duration) cubic-bezier(0.64, 0.31, 0.14, 1.57)
		);
		pointer-events: none;
		&.open {
			pointer-events: initial;
		}
		&.scale {
			scale: var(--modal-scale, 0) var(--modal-scale, 0) 1;
			&.open {
				scale: var(--modal-scale, 1) var(--modal-scale, 1) 1;
			}
		}
		&.fly {
			translate: var(--modal-fly-x, 0) var(--modal-fly-y, 5rem) var(--modal-fly-z, 0);
			&.open {
				translate: 0 0 0;
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
		grid-auto-rows: minmax(0, auto);
		grid-auto-columns: 1fr;
		place-items: center;
		padding: 1rem;
	}
	.is_error {
		background-color: pink;
		color: darkred;
	}
</style>
