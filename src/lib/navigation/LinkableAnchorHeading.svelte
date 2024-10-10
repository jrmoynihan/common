<script module lang="ts">
	export interface LinkableAnchorHeadingProps<T> extends ComponentProps<typeof AnchorHeading> {
		button_props?: ComponentProps<ButtonRunes<T>>;
		button_position?: 'before' | 'after';
		children?: Snippet;
	}
</script>

<script lang="ts" generics="T">
	import { page } from '$app/stores';
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import { faLink } from '@fortawesome/free-solid-svg-icons/index';
	import { onDestroy, type ComponentProps, type Snippet } from 'svelte';
	import AnchorHeading from './AnchorHeading.svelte';

	let styles =
		'border: 0; --button-opacity: 0.5; padding: 0rem 0.5rem; max-height: max-content; margin: 0.25rem 0.5rem;';
	let copied_styles = 'background: hsla(var(--link-background-value), 75%);';
	let copied = $state(false);
	let timeout: ReturnType<Window['setTimeout']> | undefined = $state();

	let {
		button_props = { dynamic_styles: { styles } },
		button_position = 'after',
		children,
		...heading_props
	}: LinkableAnchorHeadingProps<T> = $props();

	function copyLinkAddress() {
		const { id } = heading_props;
		const link = `${$page.url.origin}/${$page.route.id}#${id}`;
		navigator.clipboard.writeText(link);
		copied = true;
		// default_toast({ msg: 'Copied Link!', duration: 2_000 });
		timeout = window.setTimeout(() => (copied = false), 20_000);
	}

	$effect(() => {
		if (button_props?.dynamic_styles) {
			button_props.dynamic_styles.styles = copied ? styles.concat(copied_styles) : styles;
		}
	});

	onDestroy(() => clearTimeout(timeout));
</script>

{#snippet copy_link_button()}
	<ButtonRunes
		icon_props={{ icon: faLink }}
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

<style lang="scss">
	.linkable-heading {
		display: flex;
	}
</style>
