<script lang="ts">
	import { makeNavLinks } from '$lib';
	import { makeAnchorLinks } from '$lib/navigation/nav-functions';
	import { slide, fly, scale } from 'svelte/transition';
	import NavLink from '$lib/navigation/NavLink.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { aside_visible } from '$routes/stores';
	import ScrollToTopButton from '$lib/navigation/ScrollToTopButton.svelte';

	const parent_path = 'functions';
	const paths = ['contexts'];
	const context_nav_anchor_paths = [
		'set-get-readable-context',
		'set-get-writable-context',
		'set-get-derived-context'
	];
	const context_nav_anchor_link_texts = [
		'setReadableContext / getReadableContext',
		'setWritableContext / getWritableContext',
		'setDerivedContext / getDerivedContext'
	];
	const context_nav_anchors = makeAnchorLinks({
		parent_path: `${parent_path}/${paths[0]}`,
		paths: context_nav_anchor_paths,
		link_texts: context_nav_anchor_link_texts
	});
	const topics = makeNavLinks({
		paths: ['contexts#contexts'],
		parent_path,
		anchors: context_nav_anchors
	});
	onMount(() => {
		$aside_visible = true;
	});
	onDestroy(() => {
		$aside_visible = false;
	});
</script>

<aside in:fly={{ x: -300, duration: 400, delay: 0 }} out:fly={{ x: -300, duration: 400 }}>
	<ScrollToTopButton
		button_props={{
			text: 'Return to Top',
			transition: fly,
			transition_config: { y: -50 },
			static_styles:
				'position: absolute; top:0; right: 0; font-size: 0.6rem; padding: 0.5rem 1rem; border: 1px solid hsla(var(--accent-value), 50%); border-radius: 0 0 0 1rem; display: flex; max-width: 40%;'
		}}
	/>
	{#each topics as { url, link_text, anchors }, i}
		<NavLink
			{url}
			{link_text}
			static_styles={'padding: 0.5rem; background: none; font-weight: bold; font-size: 1rem; --current-nav-page-box-shadow: 0 0 8px 2px var(--accent);'}
		/>
		{#if anchors}
			<ul>
				{#each anchors as { url, link_text }, n}
					<li>
						<NavLink
							{url}
							{link_text}
							static_styles={'padding: 0rem 0.5rem; background: none; font-size: 0.75rem; --current-nav-page-box-shadow: 0 0 10px 2px var(--accent); text-align: center;'}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	{/each}
</aside>

<style lang="scss">
	ul {
		display: grid;
		gap: 0.5rem;
		margin: 1rem 0.5rem;
		padding-left: 1.5rem;
	}
	li {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		max-width: 15ch;
	}
	aside {
		box-sizing: border-box;
		background-color: hsla(0, 0%, 0%, 15%);
		padding: 1.5rem;
		height: 100rem;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		width: 18dvw;
		z-index: 2;
		backdrop-filter: blur(5px);
	}
</style>
