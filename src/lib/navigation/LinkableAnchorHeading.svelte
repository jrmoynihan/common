<script module lang="ts">
	export interface LinkableAnchorHeadingProps extends AnchorHeadingProps {
		button_attributes?: HTMLButtonAttributes;
		button_position?: 'before' | 'after';
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import AnchorHeading, { type AnchorHeadingProps } from './AnchorHeading.svelte';

	let copied = $state(false);
	let timeout: ReturnType<Window['setTimeout']> | undefined = $state();

	let {
		button_attributes,
		button_position = 'after',
		children,
		...heading_props
	}: LinkableAnchorHeadingProps = $props();

	function copyLinkAddress() {
		const { id } = heading_props;
		const link = `${page.url.origin}/${page.route.id}#${id}`;
		navigator.clipboard.writeText(link);
		copied = true;
		// default_toast({ msg: 'Copied Link!', duration: 2_000 });
		timeout = window.setTimeout(() => (copied = false), 20_000);
	}

	onDestroy(() => clearTimeout(timeout));
</script>

{#snippet copy_link_button()}
	<button
		class="border-0, opacity-50, p-0, max-h-max, m-0.5"
		aria-label="Copy Link"
		aria-pressed={copied}
		data-pressed={copied}
		onpointerdown={copyLinkAddress}
		{...button_attributes}
	>
		<Icon icon="fa6-solid:link" />
	</button>
{/snippet}

<div class="linkable-heading">
	{#if button_position === 'before'}
		{@render copy_link_button()}
	{/if}

	<AnchorHeading {...heading_props}>
		{@render children?.()}
	</AnchorHeading>

	{#if button_position === 'after'}
		{@render copy_link_button()}
	{/if}
</div>

<style>
	.linkable-heading {
		display: flex;
	}
</style>
