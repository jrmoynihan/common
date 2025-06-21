<script module lang="ts">
	export interface MiniDialogProps<T> extends Omit<FullDialogProps<T>, 'dialog'> {
		dialog?: FullDialog<T>;
	}
</script>

<script lang="ts" generics="T">
	import FullDialog, { type FullDialogProps } from './FullDialog.svelte';

	let {
		children = undefined,
		dialog = $bindable(),
		...dialog_props
	}: MiniDialogProps<T> = $props();

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
