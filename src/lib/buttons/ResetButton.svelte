<script lang="ts">
	import ButtonRunes, { type ButtonProps } from './Button_Runes.svelte';

	let { disabled = $bindable(), ...button_props }: ButtonProps = $props();
</script>

<ButtonRunes bind:disabled {...button_props} type="reset" />
