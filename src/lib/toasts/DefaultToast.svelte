<script lang="ts">
	import type { IconSize } from '$lib/lib_types.js';
	import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
	import { Fa } from 'svelte-fa';

	export let title: string = '';
	export let msg: string =
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quos, itaque exercitationem excepturi soluta, veniam enim nesciunt ab unde adipisci minus dolorem qui ducimus? Omnis fuga hic ipsum cupiditate soluta!';
	export let text_styles: string = '';
	export let header_styles: string = '';
	export let icon: IconDefinition | null = null;
	export let icon_size: IconSize = 'lg';
	export let icon_color: string = 'inherit';
</script>

<div class="default-toast">
	{#if title}
		<h3 style={header_styles}>
			{#if icon}<Fa {icon} size={icon_size} color={icon_color} />{/if}
			{title}
		</h3>
	{/if}
	{#if msg}
		<div class="toast-msg" style={text_styles}>{@html msg}</div>
	{/if}
</div>

<style lang="scss">
	.default-toast {
		display: grid;
		grid-auto-columns: minmax(0, auto);
		gap: 0.25rem;
		overflow: auto;
		word-wrap: anywhere;
		text-align: center;
	}
	.toast-msg {
		font-size: 0.85em;
	}
	h3 {
		font-weight: bold;
		margin-block: 0.25rem;
	}
</style>
