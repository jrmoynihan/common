<script lang="ts">
	import Navigation from '$lib/navigation/Navigation.svelte';

	let links = ['gallery'];
</script>

<Navigation {links} parent_path={'/recipes'} />
<slot />

<style lang="scss">
</style>
