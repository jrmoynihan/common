<script lang='ts'>
	import type { ComponentProps, Snippet } from 'svelte';
	import FullDialog from './FullDialog.svelte';

    interface MegaModalProps {
        children?: Snippet;
        dialog_props?: ComponentProps<FullDialog>;
    }

    let {
        children,
        dialog_props
    } : MegaModalProps= $props();

</script>


<FullDialog {...dialog_props} mode={'mini'} blur={null}>
    {#if children}
        {@render children()}
    {/if}
</FullDialog>