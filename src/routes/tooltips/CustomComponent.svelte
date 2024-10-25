<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface CustomComponentProps extends HTMLAttributes<HTMLElement> {
		text: string;
		background: string;
		color: string;
	}
	let {
		text = `I'm a custom component thing!`,
		background = 'blue',
		color = 'white',
		...rest
	}: CustomComponentProps = $props();
</script>

<div style:background style:color {...rest}>{text}</div>

<style lang="scss">
	div {
		color: white;
	}
</style>
