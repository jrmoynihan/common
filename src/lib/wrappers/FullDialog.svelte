<script module lang="ts">
	export interface FullDialogProps extends Omit<DialogProps, 'dialog'> {
		/** Provide a simple text for the heading.  Defaults to an <h3> element within a <header> tag and a close ('X') button positioned at the top right. 
        
        For full control, provide a `header` snippet instead.   
        */
		heading?: string;

		article_attributes?: HTMLAttributes<HTMLElement>;

		/** Modify the default `<header>` element that contains an <h3> element and the close ('X') button. */
		header_attributes?: HTMLAttributes<HTMLElement>;

		/** Modify the default <h3> element that contains the heading text inside the <header> element. */
		heading_attributes?: HTMLAttributes<HTMLHeadingElement>;

		/** Modify the default close ('X') button that is positioned at the top right of the <header> element. */
		close_x_attributes?: HTMLButtonAttributes;

		/** Props to pass to the button component that toggles the dialog. */
		button_attributes?: HTMLButtonAttributes;
		/** Provide an entire button snippet.
        
        When `undefined`, the default button snippet is used, which takes the `button_content` prop for its content and falls back to the `button_text` prop when no `button_content` is provided.
        
        When explicitly set to `null`, no button is shown. */
		button?: Snippet | null;

		footer_children?: Snippet | null;

		/** Provide complex child content to the button.
        
        Content to render inside the opening/closing button. */
		button_content?: Snippet | string | null;

		/** A snippet for the dialog's header. Defaults to an <h3> element within a <header> tag and a close ('X') button positioned at the top right. */
		header?: Snippet | null;

		/** A snippet for the dialog's footer. Defaults to a <footer> tag containing a <menu> element with a 'Close' button. */
		footer?: Snippet | null;

		/** The type of modal to use.  (Default: 'full')
		
		Full mode will provide a blurred backdrop and on small screens will be positioned at the bottom, and provide an additional slide-down animation when closing.

		Mini mode will not blur the backdrop and will be positioned at the center on the screen.
		*/
		mode?: 'full' | 'mini';

		/** The number of pixels to blur the ::backdrop pseudo-element background when `mode: 'full'` (default: null) */
		blur?: number | null;

		/** A binding to the <Dialog> component itself */
		dialog?: Dialog;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { type Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import Dialog, { type DialogProps } from './Dialog.svelte';

	export const open = () => {
		dialog?.open();
	};
	export const close = () => {
		dialog?.close();
	};

	let {
		heading,
		article_attributes,
		header_attributes,
		heading_attributes,
		close_x_attributes,
		button_attributes,
		button_content,
		footer_children,
		children,
		button = default_button,
		header = default_header,
		footer = default_footer,
		blur = 10,
		dialog = $bindable(),
		...dialog_props
	}: FullDialogProps = $props();
</script>

{#snippet default_footer()}
	<footer>
		<menu>
			{@render footer_children?.()}
		</menu>
	</footer>
{/snippet}

{#snippet default_header()}
	<header {...header_attributes}>
		<h3 {...heading_attributes}>
			{heading}
		</h3>
		<button
			{...close_x_attributes}
			onclick={dialog?.close}
			class={['close-button absolute top-0 right-0 cursor-pointer', close_x_attributes?.class]}
		>
			<Icon icon="fa6-solid:xmark" />
		</button>
	</header>
{/snippet}

{#snippet default_button()}
	<button {...button_attributes} onclick={dialog?.open}>
		{#if typeof button_content === 'string'}
			{button_content}
		{:else if button_content}
			{@render button_content?.()}
		{/if}
	</button>
{/snippet}

{@render button?.()}
<Dialog bind:this={dialog} mode="full" {blur} {...dialog_props}>
	{@render header?.()}

	<!-- TODO: add back to avoid tabbable while closed: 
        style:display={attributes?.open ? 'block' : 'none'}
    -->
	<article {...article_attributes}>
		{@render children?.()}
	</article>

	{@render footer?.()}
</Dialog>

<style>
	@layer common.dialog.full-dialog {
		article {
			overflow-y: auto;
			max-block-size: 100%; /* safari */
			overscroll-behavior-y: contain;
			display: grid;
			justify-items: start;
			gap: var(--size-3);
			padding-inline: var(--size-5);
			/* padding-block: var(--size-3);  /* caused grid overflow when too big */
		}

		header {
			position: relative;
			display: flex;
			gap: 0.5rem;
			justify-content: space-between;
			align-items: flex-start;
			padding-block: 0.5rem;
			padding-inline: 1rem;
		}

		footer {
			display: flex;
			flex-wrap: wrap;
			gap: var(--size-3);
			justify-content: space-between;
			align-items: flex-start;
			padding-inline: var(--footer-padding-inline, var(--size-5));
			margin-block-start: var(--footer-margin-block-start, var(--size-2));

			& > menu {
				display: flex;
				flex-wrap: wrap;
				gap: var(--size-3);
				padding-inline-start: 0;
				&:only-child {
					margin-inline-start: auto; /* floats lone items to the right */
				}
			}
		}

		@layer button {
			:global(.button.close-button) {
				top: 0.25rem;
				right: 0.25rem;
				border-radius: var(--radius-round);
				padding: 0.5ch 1ch;
				aspect-ratio: 1;
				flex-shrink: 0;
				place-items: center;
				stroke: currentColor;
				stroke-width: 3px;
				font-weight: bold;
			}
		}
	}
</style>
