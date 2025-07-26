<script lang="ts">
	import { JsonView } from '$lib';
	import BreadcrumbRunes from '$navigation/BreadcrumbRunes.svelte';
	import Carousel from '$navigation/Carousel.svelte';

	let { data } = $props();
	let crumbs = {
		FPS: {},
		RPG: {
			AAA: {},
			indie: {
				new: {},
				'on sale': {},
				'under 5': {}
			},
			'self published': {}
		},
		brawler: {},
		'dungeon crawler': {},
		sports: {},
		puzzle: {}
	};

	const items = data.picture_data;
	let carousel = $state<Carousel>();
</script>

<section>
	<h3>Navigation with Transition</h3>
	<p>
		This is a simple scaffold to make a page layout with its own level of navigation (i.e. you can
		nest multiple navigations), and a transition to trigger when moving between its child pages.
		(Hint: it's used on this page and throughout the site!)
	</p>
	<BreadcrumbRunes {crumbs} />
	<h3>A Default Carousel</h3>
	<Carousel
		{items}
		pagination_type="dots"
		bind:this={carousel}
		on_item_change={(i, e) => console.log('item_change', i, e)}
	>
		{#snippet item_snippet(item)}
			<JsonView obj={item} />
		{/snippet}
	</Carousel>
	<h3>A Gallery Carousel</h3>
	<Carousel {items} pagination_type="gallery">
		{#snippet item_snippet(item: {
			image: string;
			title: string;
			description: string;
			width: number;
			height: number;
			id: number;
			created_at: string;
			url: string;
		})}
			<div>
				<img
					width={item.width}
					height={item.height}
					src={item.url}
					alt={item.description}
					id={item.id.toString()}
				/>
				<h5>{item.title}</h5>
				<p>{item.description}</p>
				<em>{item.created_at}</em>
			</div>
		{/snippet}
	</Carousel>
</section>

<style>
	section {
		display: grid;
		justify-items: center;
		justify-self: center;
		padding: 3rem;
		padding-top: 1rem;
		max-width: max-content;
	}
	p {
		max-width: 80ch;
		line-height: 1.2;
	}
</style>
