<!-- @component
Inspired by Adam Argyle @ https://web.dev/articles/building/a-dialog-component
-->
<script context="module">
	interface ExtendedDialog extends HTMLDialogAttributes {
        onopen?: () => void | Promise<void>;
		onopening?: () => void | Promise<void>;
        onclose?: () => void | Promise<void>;
		onclosing?: () => void | Promise<void>;
    }
</script>

<script lang="ts">
	import { dialog } from '$actions/dialog/dialog';
	import { type Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	// onclose?: () => void | Promise<void>;
	// onopen?: () => void | Promise<void>;
		
	interface ModalProps {
		/** Provided child content */
		children?: Snippet;
		/** A binding to the <dialog> element */
		modal?: HTMLDialogElement | undefined;
		/** What type of modal is it? */
		mode?: 'full' | 'mini';
		/** Number of pixels to blur the ::backdrop pseudo-element background? (default: null) */
		blur?: number | null;
		/** In which direction should the dialog scale? */
		scale?: 'in' | 'out' | 'both' | 'none';
		/** In which direction should the dialog slide? */
		slide?: 'in' | 'out' | 'both' | 'none';
		/** In which direction should the dialog slide in from? */
		slide_in_from?: 'left' | 'right' | 'top' | 'bottom';
		/** In which direction should the dialog slide out to? */
		slide_out_to?: 'left' | 'right' | 'top' | 'bottom';
		/** Additional attributes to add to or access on the <dialog> element, including the added opening and closing events. */
		attributes?: ExtendedDialog;
	}

	let { 
		children,
		modal,
		mode = 'full',
		blur = null,
		scale = 'out',
		slide = 'in',
		slide_in_from = 'bottom',
		slide_out_to = 'top',
		attributes,
	} : ModalProps = $props();
	
	export const close = async () => {
		modal?.close()
	}
	export const open = async () => {
		modal?.showModal();
	}

</script>

<!-- Could use this to use custom events, instead of the `dialog.ts` action?
https://svelte.dev/docs/typescript#enhancing-built-in-dom-types
-->
<dialog
	use:dialog
	class="dialog"
	class:blur
	class:scale-in={scale === 'in' || scale === 'both'}
	class:scale-out={scale === 'out' || scale === 'both'}
	class:slide-in-from-left={slide_in_from === 'left' && (slide === 'in' || slide === 'both')}
	class:slide-in-from-right={slide_in_from === 'right' && (slide === 'in' || slide === 'both')}
	class:slide-in-from-top={slide_in_from === 'top' && (slide === 'in' || slide === 'both')}
	class:slide-in-from-bottom={slide_in_from === 'bottom' && (slide === 'in' || slide === 'both')}
	class:slide-out-to-left={slide_out_to === 'left' && (slide === 'out' || slide === 'both')}
	class:slide-out-to-right={slide_out_to === 'right' && (slide === 'out' || slide === 'both')}
	class:slide-out-to-top={slide_out_to === 'top' && (slide === 'out' || slide === 'both')}
	class:slide-out-to-bottom={slide_out_to === 'bottom' && (slide === 'out' || slide === 'both')}
	data-mode={mode}
	bind:this={modal}
	style:--blur={typeof blur === 'number' ? `${blur}px` : `0`}
	{...attributes}
	>	
	<form method="dialog" class="modal-foreground">
		{#if children}
			{@render children()}
		{/if}
	</form>
</dialog>

<style lang="scss">
	@layer modal {
		:global(html:has(dialog[open][data-mode="full"])) {
 	 		overflow: hidden;  // prevent body from scrolling
		}
		.dialog {

			// May need to modify the `overflow` property to allow tooltips to escape the edges.
			display: grid; 
			scrollbar-width: thin;
			border-radius: var(--radius-3);
			box-shadow: var(--shadow-2);
			background: var(--dialog-background, var(--background, inherit));
			color: var(--dialog-color, var(--color, inherit));
			font-size: initial;
			width: var(--dialog-width, max-content);
			// height: var(--dialog-height, initial); // probably don't want to set this
			border: var(--dialog-border, initial);
			place-self: var(--dialog-place-self, center);
			align-content: start;
			max-block-size: min(80vh, 100%);
			max-block-size: var(--dialog-max-block-size, min(80dvb, 100%));
			max-inline-size: var(--dialog-max-inline-size, min(90vw, 70ch));
			overflow: var(--dialog-overflow, hidden);
			transition: opacity var(--duration, 0.5s) var(--ease-3);
			transition-behavior: allow-discrete;
			animation-timing-function: var(--ease-squish-3);
			animation-duration: var(--duration, 0.5s);
			margin: auto; 	// centers the dialog for bad browser user-agent stylesheets that default to top-left
			padding: 0;
			position: fixed;
			inset: 0;

			/** Future CSS */
			&, &::backdrop {
				transition: opacity 0.5s, display 0.5s allow-discrete, overlay 0.5s allow-discrete, backdrop-filter var(--duration, 0.5s);
			}

			&::backdrop{
				backdrop-filter: none;
				opacity: 0;
			}
			&.scale-out {
				animation: var(--animation-scale-down) forwards; // The 'out' transition
				
			}

			/** Full-screen mode */
			&[data-mode="full"] {
				&.blur[open]::backdrop {
					backdrop-filter: blur(var(--blur));
					opacity: 1;
				}
				@media (width < 768px) {
						margin-block-end: 0;
						border-end-end-radius: 0;
						border-end-start-radius: 0;
						// Mobile 'out' transition
						animation: var(--animation-slide-out-down) forwards; 
					}
			}

			
			&:has( .tooltip){
				overflow: visible;
			}
			&:not([open]){
				pointer-events: none;
				opacity: 0;
				// Hide elements within the dialog from interaction when it is not open
				& * {
					transition: visibility var(--duration, 0.5s) ease;
					visibility: hidden;
				}
			}
			&[open] {
				display: grid;
				pointer-events: initial;
				&.slide-in-from-bottom {
					animation: var(--animation-slide-in-up) forwards; // The 'in' transition
				}
			}
			// &.scale{
				// scale: 0;
				// transition-property: scale, display, overlay;
				// transition-duration: var(--transition-duration, 500ms);
				// transition-timing-function: cubic-bezier(0.34, 0.61, 1, 0.8);
				// animation-duration: var(--transition-duration, 500ms);
				
				// &[open]{
					// animation-fill-mode: forwards;
					// animation-play-state: running;
					// scale: 1;
					// opacity: 1;
				// }
			// }
			
			&::backdrop {
				background-color: hsla(0, 0%, 0%, 0.4);
				padding: 10rem;
				&.blur{
					backdrop-filter: blur(10px);
				}
			}
			& *:focus-visible{
				outline: red 1px solid !important;
			}
			& > form {
				display: grid;
				grid-template-rows: auto 1fr auto;
				align-items: start;
				max-block-size: 80vh;
				max-block-size: 80dvb;
				padding: var(--dialog-form-padding, 0.5rem);
			}
		}

		/** Scale in the modal when it opens with an elastic bounce. */
		@keyframes modal {
			0% {
				scale: 0;
				opacity: 0;
			}
			50% {
				scale: 0.75;
				opacity: 0.75;
			}
			75% {
				scale: 1.5;
				opacity: 0.9;
			}
			100% {
				scale: 1;
				opacity: 1;
			}
		}
	}

	
</style>