<script module lang="ts">
	export interface LinkableAnchorHeadingProps extends AnchorHeadingProps {
		button_props?: ButtonProps;
		button_position?: 'before' | 'after';
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { page } from '$app/state';
	import ButtonRunes, { type ButtonProps } from '$buttons/Button_Runes.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import AnchorHeading, { type AnchorHeadingProps } from './AnchorHeading.svelte';

	let style =
		'border: 0; --button-opacity: 0.5; padding: 0rem 0.5rem; max-height: max-content; margin: 0.25rem 0.5rem;';
	let copied_styles = 'background: hsla(var(--link-background-value), 75%);';
	let copied = $state(false);
	let timeout: ReturnType<Window['setTimeout']> | undefined = $state();

	let {
		button_props = { style },
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
	<ButtonRunes
		icon_props={{ icon: 'fa6-solid:link' }}
		aria-label="Copy Link"
		aria-pressed={copied}
		data-pressed={copied}
		onpointerdown={copyLinkAddress}
		{...button_props}
	/>
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
