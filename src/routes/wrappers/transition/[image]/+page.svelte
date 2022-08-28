<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '.svelte-kit/types/src/routes/wrappers/transition/$types';

	export let data: PageData;
	const image = data.links.find((link) => link.path === $page.params.image);
</script>

<h2>{image?.text}</h2>
<img src={image?.href} alt={image?.text} />

<style lang="scss">
	h2 {
		margin: auto;
	}
	img {
		width: 100%;
		max-height: 70%;
		object-fit: contain;
	}
</style>
