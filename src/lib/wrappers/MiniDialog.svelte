<script context='module' lang='ts'>
    export interface MiniDialogProps<T> extends FullDialogProps<T> {}
</script>

<script lang='ts' generics="T">
	import FullDialog, { type FullDialogProps } from './FullDialog.svelte';


    let {
        children = undefined,
        ...dialog_props
    } : MiniDialogProps<T> = $props();

</script>


<FullDialog {...dialog_props} mode={'mini'} blur={null}>
    {@render children?.()}
</FullDialog>