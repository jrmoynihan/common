<script lang="ts" generics="T">
	import ButtonRunes from './Button_Runes.svelte';
	import type { ButtonProps } from './Button_Runes.svelte';

	let { disabled = $bindable(), ...button_props }: ButtonProps<T> = $props();
</script>

<ButtonRunes bind:disabled {...button_props} type="reset" />
