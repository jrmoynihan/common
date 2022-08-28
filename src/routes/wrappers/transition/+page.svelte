<script lang="ts">
	import type { PageData } from '.svelte-kit/types/src/routes/wrappers/transition/$types';

	export let data: PageData;
	console.log('data', data);
	const { links } = data;
</script>

<style lang="scss">
</style>
