<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon, { type IconProps } from '@iconify/svelte';

	interface DefaultToastProps {
		title: string;
		header_attributes?: HTMLAttributes<HTMLHeadingElement>;
		icon_attributes?: IconProps;
		header?: Snippet<[string, HTMLAttributes<HTMLHeadingElement>?, IconProps?]>;
		children: Snippet;
	}

	let {
		title = '',
		header_attributes,
		icon_attributes = { icon: 'fa6-solid:bread-slice', color: 'inherit' },
		header = default_header,
		children
	}: DefaultToastProps = $props();
</script>

{#snippet default_header(
	title: string,
	header_attributes?: HTMLAttributes<HTMLHeadingElement>,
	icon_attributes?: IconProps
)}
	<h3 {...header_attributes}>
		{#if icon_attributes}
			<Icon {...icon_attributes} />
		{/if}
		{title}
	</h3>
{/snippet}

<div class="default-toast-container">
	{#if title && header}
		{@render header(title, header_attributes, icon_attributes)}
	{/if}
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.default-toast-container {
		display: grid;
		grid-auto-columns: minmax(0, auto);
		gap: 0.25rem;
		overflow: auto;
		word-wrap: anywhere;
		text-align: center;
	}
	h3 {
		font-weight: bold;
		margin-block: 0.25rem;
	}
</style>
