<script lang="ts">
	import ButtonRunes, { type ButtonProps } from './Button_Runes.svelte';

	let { ...button_props }: ButtonProps = $props();
</script>

<ButtonRunes {...button_props} type="reset" />
