<script lang="ts">
	import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface DefaultToastProps {
		title: string;
		header_attributes?: HTMLAttributes<HTMLHeadingElement>;
		icon_attributes?: ComponentProps<Fa>;
		header?: Snippet<[string, HTMLAttributes<HTMLHeadingElement>?, ComponentProps<Fa>?]>;
		children: Snippet;
	}

	let {
		title = '',
		header_attributes,
		icon_attributes = { icon: faBreadSlice, size: 'lg', color: 'inherit' },
		header = default_header,
		children
	}: DefaultToastProps = $props();
</script>

{#snippet default_header(
	title: string,
	header_attributes?: HTMLAttributes<HTMLHeadingElement>,
	icon_attributes?: ComponentProps<Fa>
)}
	<h3 {...header_attributes}>
		{#if icon_attributes}
			<Fa {...icon_attributes} />
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
