<script lang='ts'>

	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import { type ComponentProps, type Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import Dialog from './Dialog.svelte';

    interface FullDialogProps {
        heading?: string;
        button_text?: string;
        button_props?: ComponentProps<ButtonRunes>;
        button?: Snippet | null;
        children?: Snippet;
        header?: Snippet | null;
        footer?: Snippet | null;
        open?: () => Promise<void>;
        close?: () => Promise<void>;
        onclose?: () => void | Promise<void>;
        attributes?: ExtendedDialog;
        mode?: 'full' | 'mini'
        blur?: number | null,
        dialog_props?: ComponentProps<Dialog>
    }
    interface ExtendedDialog extends HTMLDialogAttributes {
        onopen?: () => void | Promise<void>;
		onopening?: () => void | Promise<void>;
        onclose?: () => void | Promise<void>;
		onclosing?: () => void | Promise<void>;
    }

    let {
        heading,
        button_text,
        button_props,
        button,
        children,
        header,
        footer,
        open = () => dialog?.open(),
        close = () => dialog?.close(),
        attributes,
        mode = 'full', 
        blur = 10,
        dialog_props
    } : FullDialogProps = $props();
    
    let dialog: Dialog;

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
    <ButtonRunes {...button_props} attributes={{ onclick: open}} >
    {button_text}
</ButtonRunes>
{/snippet}

{#if button}
    {@render button()}
{:else if button !== null}
    {@render default_button()}
{/if}
<Dialog
bind:this={dialog} 
{mode}
{blur}
{attributes}
{...dialog_props}
>
    <!-- Explicit `null` removes the header entirely, but `undefined` will use the default -->
    {#if header}
        {@render header()}
    {:else if header !== null}
        {@render default_header()}
    {/if}

    {#if children}
    <!-- TODO: add back to avoid tabbable while closed: style:display={attributes?.open ? 'block' : 'none'} -->
        <article>
            {@render children()}
        </article>
    {/if}

    <!-- Explicit `null` removes the footer entirely, but `undefined` will use the default -->
    {#if footer}
        {@render footer()}
    {:else if footer !== null}
        {@render default_footer()}
    {/if}
</Dialog>

<style lang='scss'>
    @layer full-dialog {
        article {
            overflow-y: auto;
            max-block-size: 100%; /* safari */
            overscroll-behavior-y: contain;
            display: grid;
            justify-items: start;
            gap: var(--size-3);
            // box-shadow: var(--shadow-2);
            padding-inline: var(--size-5);
            // padding-block: var(--size-3);  /* caused grid overflow when too big */
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
            // padding-block: var(--size-3);

            &  > menu {
                display: flex;
                flex-wrap: wrap;
                gap: var(--size-3);
                padding-inline-start: 0;
                &:only-child {
                    margin-inline-start: auto;  // floats lone items to the right
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