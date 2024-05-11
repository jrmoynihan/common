<script context='module' lang='ts'>
    export interface MiniDialogProps extends FullDialogProps {}
</script>

<script lang='ts'>
	import FullDialog, { type FullDialogProps } from './FullDialog.svelte';


    let {
        children = undefined,
        ...dialog_props
    } : MiniDialogProps = $props();

</script>


<FullDialog {...dialog_props} mode={'mini'} blur={null}>
    {#if children}
        {@render children()}
    {/if}
</FullDialog>