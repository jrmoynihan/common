<!-- @component
Inspired by Adam Argyle @ https://web.dev/articles/building/a-dialog-component
-->
<script module>
	export interface DialogProps extends Omit<HTMLDialogAttributes, 'open'> {
		/** A binding to the <dialog> element */
		dialog?: HTMLDialogElement;
		form_attributes?: HTMLFormAttributes;
		/** The type of modal to use.  (Default: 'full')
		
		Full mode will provide a blurred backdrop and on small screens will be positioned at the bottom, and provide an additional slide-down animation when closing.

		Mini mode will not blur the backdrop and will be positioned at the center on the screen.
		*/
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
		/** A callback to run *after* the dialog opens. */
		onopened?: () => void | Promise<void>;
		/** A callback to run *before* the dialog opens. */
		onopening?: () => void | Promise<void>;
		/** A callback to run *after* the dialog closes. */
		onclosed?: () => void | Promise<void>;
		/** A callback to run *before* the dialog closes. */
		onclosing?: () => void | Promise<void>;
	}
</script>

<script lang="ts">
	import { dialog as dialog_action } from '$actions/dialog/dialog';
	import type { HTMLDialogAttributes, HTMLFormAttributes } from 'svelte/elements';

	export const close = async () => {
		onclosing?.();
		dialog?.close();
		onclosed?.();
	};
	export const open = async () => {
		onopening?.();
		dialog?.showModal();
		onopened?.();
	};

	let {
		children,
		onopening,
		onclosing,
		onopened,
		onclosed,
		dialog = $bindable(),
		form_attributes,
		mode = 'full',
		blur = null,
		scale = 'out',
		slide = 'in',
		slide_in_from = 'bottom',
		slide_out_to = 'top',
		...attributes
	}: DialogProps = $props();
</script>

<!-- Could use this to use custom events, instead of the `dialog.ts` action?
https://svelte.dev/docs/typescript#enhancing-built-in-dom-types
-->
<dialog
	bind:this={dialog}
	use:dialog_action
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
	style:--blur={typeof blur === 'number' ? `${blur}px` : `0`}
	{...attributes}
>
	<form method="dialog" class="modal-foreground" {...form_attributes}>
		{@render children?.()}
	</form>
</dialog>

<style>
	@layer modal {
		:global(html:has(dialog[open][data-mode='full'])) {
			overflow: hidden; /* prevent body from scrolling */
		}
		.dialog {
			/* May need to modify the `overflow` property to allow tooltips to escape the edges. */
			display: grid;
			scrollbar-width: thin;
			border-radius: var(--radius-3);
			box-shadow: var(--shadow-2);
			background: var(--dialog-background, var(--background, inherit));
			color: var(--dialog-color, var(--color, inherit));
			font-size: initial;
			width: var(--dialog-width, max-content);
			/* height: var(--dialog-height, initial); // probably don't want to set this */
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
			margin: auto; /* centers the dialog for bad browser user-agent stylesheets that default to top-left */
			padding: 0;
			position: fixed;
			inset: 0;

			/** Future CSS */
			&,
			&::backdrop {
				transition:
					opacity 0.5s,
					display 0.5s allow-discrete,
					overlay 0.5s allow-discrete,
					backdrop-filter var(--duration, 0.5s);
			}

			&::backdrop {
				backdrop-filter: none;
				opacity: 0;
			}
			&.scale-out {
				animation: var(--animation-scale-down) forwards; /* The 'out' transition */
			}

			/** Full-screen mode */
			&[data-mode='full'] {
				&.blur[open]::backdrop {
					backdrop-filter: blur(var(--blur));
					opacity: 1;
				}
				@media (width < 768px) {
					margin-block-end: 0;
					border-end-end-radius: 0;
					border-end-start-radius: 0;
					/* Mobile 'out' transition */
					animation: var(--animation-slide-out-down) forwards;
				}
			}

			&:has(.tooltip) {
				overflow: visible;
			}
			&:not([open]) {
				pointer-events: none;
				opacity: 0;
				/* Hide elements within the dialog from interaction when it is not open */
				& * {
					transition: visibility var(--duration, 0.5s) ease;
					visibility: hidden;
				}
			}
			&[open] {
				display: grid;
				pointer-events: initial;
				&.slide-in-from-bottom {
					animation: var(--animation-slide-in-up) forwards; /* The 'in' transition */
				}
			}
			/* &.scale{
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
			// } */

			&::backdrop {
				background-color: hsla(0, 0%, 0%, 0.4);
				padding: 10rem;
				&.blur {
					backdrop-filter: blur(10px);
				}
			}
			& *:focus-visible {
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
