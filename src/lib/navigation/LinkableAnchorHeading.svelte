<script lang="ts">
	import { page } from '$app/stores';
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import { defaultToast } from '$toasts/toasts.js';
	import { faLink } from '@fortawesome/free-solid-svg-icons/index';
	import { onDestroy, type ComponentProps, type Snippet } from 'svelte';
	import AnchorHeading from './AnchorHeading.svelte';
	
	interface LinkableHeadingProps {
		heading_props: ComponentProps<AnchorHeading>;
		button_props?: ComponentProps<ButtonRunes>;
		button_position?: 'before' | 'after'
		children?: Snippet
	}
		
	let styles = 'border: 0; --button-opacity: 0.5; padding: 0rem 0.5rem; max-height: max-content; margin: 0.25rem 0.5rem;'
	let copied_styles = 'background: hsla(var(--link-background-value), 75%);';
	let copied = $state(false);
	let timeout: NodeJS.Timeout | undefined = $state();

	let {
		heading_props,
		button_props = { dynamic_styles: { styles }},
		button_position = 'after',
		children
	} : LinkableHeadingProps = $props();

	function copyLinkAddress() {
		const { id } = heading_props;
		const link = `${$page.url.origin}/${$page.route.id}#${id}`;
		navigator.clipboard.writeText(link);
		copied = true;
		defaultToast({ msg: 'Copied Link!', duration: 2_000 });
		timeout = setTimeout(() => (copied = false), 20_000);
	}

	$effect(()=>{
		if(button_props?.dynamic_styles){
			button_props.dynamic_styles.styles = copied ? styles.concat(copied_styles) : styles;
		}
	}) 

	onDestroy(() => clearTimeout(timeout));
</script>

<div class="linkable-heading">
	{#if button_position === 'before'}
		<ButtonRunes icon_props={{ icon: faLink }} attributes={{ 'aria-label': 'Copy Link', 'aria-pressed': copied, 'data-pressed': copied, onpointerdown: copyLinkAddress}} {...button_props} />
		{/if}
		<AnchorHeading {...heading_props}>
			{#if children}
			{@render children()}
			{/if}
		</AnchorHeading>
		{#if button_position === 'after'}
		<ButtonRunes icon_props={{ icon: faLink }} attributes={{ 'aria-label': 'Copy Link', 'aria-pressed': copied, 'data-pressed': copied, onpointerdown: copyLinkAddress}} {...button_props} />
	{/if}
</div>

<style lang="scss">
	.linkable-heading {
		display: flex;
	}
</style>
