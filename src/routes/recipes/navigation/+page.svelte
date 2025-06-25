<script lang="ts">
	import BreadcrumbRunes from '$navigation/BreadcrumbRunes.svelte';

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
</script>

<section>
	<h3>Navigation with Transition</h3>
	<p>
		This is a simple scaffold to make a page layout with its own level of navigation (i.e. you can
		nest multiple navigations), and a transition to trigger when moving between its child pages.
		(Hint: it's used on this page and throughout the site!)
	</p>
	<BreadcrumbRunes {crumbs} />
	<!-- <NavigationTransitionExample /> -->
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
