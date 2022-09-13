<script lang="ts">
	import Button from '$lib/buttons/Button.svelte';
	import type { ComponentProps } from 'svelte';

	export let button_props: ComponentProps<Button>;
	/** The percent at which the scroll-to-top button becomes visible.  E.g., 10% would be 10*/
	export let threshold: number = 10;
	let progress: number = 0;
	let scrollY: number = 0;
	let meets_visibility_threshold: boolean = false;

	function checkScrollDistance() {
		window.requestAnimationFrame(() => {
			const total_scroll_distance =
				document.documentElement.scrollHeight - document.documentElement.clientHeight;
			progress = (scrollY * 100) / total_scroll_distance;
		});
	}
	$: meets_visibility_threshold = progress >= threshold;
</script>

<svelte:window bind:scrollY on:scroll={checkScrollDistance} />
{#if meets_visibility_threshold}
	<Button {...button_props} on:click={() => scrollTo({ top: 0, behavior: 'smooth' })}>
		<slot />
	</Button>
{/if}

<style lang="scss">
</style>
