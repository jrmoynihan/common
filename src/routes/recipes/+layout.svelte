<script lang="ts">
	import { makeNavLinks, NavigationLink } from '$lib/navigation/navLink';
	import Navigation from '$lib/navigation/Navigation.svelte';

	const paths: string[] = ['gallery'];
	const nav_links: NavigationLink[] = makeNavLinks(paths, 'recipes');
</script>

<Navigation {nav_links} />
<slot />

<style lang="scss">
</style>
