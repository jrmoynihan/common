<script module lang="ts">
	export interface MiniDialogProps extends Omit<FullDialogProps, 'dialog'> {
		dialog?: FullDialog;
	}
</script>

<script lang="ts">
	import FullDialog, { type FullDialogProps } from './FullDialog.svelte';

	let { children = undefined, dialog = $bindable(), ...dialog_props }: MiniDialogProps = $props();

	export const open = () => {
		dialog?.open();
	};
	export const close = () => {
		dialog?.close();
	};
</script>

<FullDialog bind:this={dialog} {...dialog_props} mode={'mini'} blur={null}>
	{@render children?.()}
</FullDialog>
