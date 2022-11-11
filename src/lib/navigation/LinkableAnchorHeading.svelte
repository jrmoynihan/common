<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$buttons/Button.svelte';
	import { defaultToast } from '$toasts/toasts.js';
	import { faLink } from '@fortawesome/free-solid-svg-icons/index';
	import { onDestroy, type ComponentProps } from 'svelte';

	import AnchorHeading from './AnchorHeading.svelte';

	let copied = false;
	let timeout: NodeJS.Timeout;
	export let styles =
		'border: 0; --button-opacity: 0.5; padding: 0rem 0.5rem; max-height: max-content; margin: 0.25rem 0.5rem;';
	export let copied_styles = 'background: hsla(var(--link-background-value), 75%);';
	export let button_placement: 'before' | 'after' = 'after';
	export let heading_props: ComponentProps<AnchorHeading>;
	export let button_props: ComponentProps<Button> = {
		styles,
		hover_styles: '--button-hover-opacity: 1'
	};

	function copyLinkAddress() {
		const { id } = heading_props;
		const link = `${$page.url.origin}/${$page.route.id}#${id}`;
		navigator.clipboard.writeText(link);
		copied = true;
		defaultToast({ msg: 'Copied Link!', duration: 2_000 });
		timeout = setTimeout(() => (copied = false), 20_000);
	}

	$: button_props.styles = copied ? styles.concat(copied_styles) : styles;

	onDestroy(() => clearTimeout(timeout));
</script>

<div class="linkable-heading">
	{#if button_placement === 'before'}
		<Button icon={faLink} on:click={copyLinkAddress} {...button_props} />
	{/if}
	<AnchorHeading {...heading_props}>
		<slot />
	</AnchorHeading>
	{#if button_placement === 'after'}
		<Button icon={faLink} on:click={copyLinkAddress} {...button_props} />
	{/if}
</div>

<style lang="scss">
	.linkable-heading {
		display: flex;
	}
</style>
