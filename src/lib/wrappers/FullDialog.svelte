<script context="module" lang="ts">
    export interface FullDialogProps extends Omit<DialogProps, 'dialog'> {
        /** Provide a simple text for the heading.  Defaults to an <h3> element within a <header> tag and a close ('X') button positioned at the top right. 
        
        For full control, provide a `header` snippet instead.   
        */
        heading?: string;

        /** Simple text within the button.
        
        For more complex text, use the `button_content` snippet, which avoids the need to reimplement the `onclick: ()=> dialog.open()` handler provided by the default button snippet
        
        For full control, provide a `button` snippet instead. */
        button_text?: string;

        /** Props to pass to the button component that toggles the dialog. */
        button_props?: ComponentProps<ButtonRunes>;
        /** Provide an entire button snippet.
        
        When `undefined`, the default button snippet is used, which takes the `button_content` prop for its content and falls back to the `button_text` prop when no `button_content` is provided.
        
        When explicitly set to `null`, no button is shown. */
        button?: Snippet | null;

        /** Provide complex child content to the button.
        
        When explicitly set to `null` or left `undefined`, falls back to using `button_text` to provide content to the button. */
        button_content?: Snippet | null;

        /** A snippet for the dialog's header. Defaults to an <h3> element within a <header> tag and a close ('X') button positioned at the top right. */
        header?: Snippet | null;

        /** A snippet for the dialog's footer. Defaults to a <footer> tag containing a <menu> element with a 'Close' button. */
        footer?: Snippet | null;

        onclosing?: () => void | Promise<void>;
        onopening?: () => void | Promise<void>;
            
        /** The type of modal to use.  (Default: 'full')
		
		Full mode will provide a blurred backdrop and on small screens will be positioned at the bottom, and provide an additional slide-down animation when closing.

		Mini mode will not blur the backdrop and will be positioned at the center on the screen.
		*/
        mode?: 'full' | 'mini'

        /** The number of pixels to blur the ::backdrop pseudo-element background when `mode: 'full'` (default: null) */
        blur?: number | null,
        
        /** A binding to the <dialog> element itself */
        dialog?: Dialog;
    }
</script>

<script lang='ts'>

	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import { type ComponentProps, type Snippet } from 'svelte';
	import Dialog, { type DialogProps } from './Dialog.svelte';

    let {
        heading,
        button_props,
        button_content,
        children,
        button = default_button,
        header = default_header,
        footer = default_footer,
        blur = 10,
        dialog = $bindable(),
        ...dialog_props
    } : FullDialogProps = $props();
    

    export function open() {
        dialog?.onopening?.();
        dialog?.open();
    }
    export function close() {
        dialog?.onclosing?.();
        dialog?.close();
    }

</script>

{#snippet default_footer()}
    <footer>
        <menu>
            <ButtonRunes
                classes={`close-button`}
                >
                Close
            </ButtonRunes>
        </menu>
    </footer>
{/snippet}

{#snippet default_header()}
    <header>
        <h3>
            {heading}
        </h3>
        <ButtonRunes classes="close-button absolute" >
            X
        </ButtonRunes>
    </header>
{/snippet}

{#snippet default_button()}
    <ButtonRunes {...button_props} onclick={open} >
        {#if button_content}
            {@render button_content()}
        {/if}
    </ButtonRunes>
{/snippet}

{#if button}
    {@render button()}
{/if}
<Dialog
    bind:this={dialog} 
    mode='full'
    {blur}
    {...dialog_props}
>
    {#if header}
        {@render header()}
    {/if}

    {#if children}
    <!-- TODO: add back to avoid tabbable while closed: 
        style:display={attributes?.open ? 'block' : 'none'}
    -->
        <article>
            {@render children()}
        </article>
    {/if}

    {#if footer}
        {@render footer()}
    {/if}
</Dialog>

<style>
    @layer full-dialog {
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
            padding-inline: var(--size-5);
            /* padding-block: var(--size-3); */

            &  > menu {
                display: flex;
                flex-wrap: wrap;
                gap: var(--size-3);
                padding-inline-start: 0;
                &:only-child {
                    margin-inline-start: auto;  /* floats lone items to the right */
                }
            }
        }

        @layer button {:global(.button.close-button.absolute) {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
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