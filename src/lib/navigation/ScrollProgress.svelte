<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/buttons/Button.svelte';
	import type { ComponentProps } from 'svelte';
	import { spring } from 'svelte/motion';

	/** Style or modify the Return To Top button */
	export let button_props: ComponentProps<Button> = {};
	/** The percent at which the scroll-to-top button becomes visible.  E.g., 10% would be 10*/
	export let threshold: number = 10;
	/** The scroll progess up and down the page, expressed as a percent. */
	export const progress = spring<number>(0, { damping: 0.5, stiffness: 0.1 });
	/** Should a return-to-top button be shown when the scroll progress passes the given threshold? */
	export let show_return_to_top_button = true;
	/** Should a scroll progess bar be displayed on the page? */
	export let show_progress_bar = false;
	/** Should a conical radiaul display the scroll progress on the page? */
	export let show_progress_radial = false;
	/** The scroll distance donw the page */
	let scrollY: number = 0;
	/** If the progress indicators or scroll-to-top button meet the scroll percentage threshold to become visible */
	let meets_visibility_threshold: boolean = false;

	function checkScrollProgress() {
		if (browser) {
			window.requestAnimationFrame(() => {
				const total_scroll_distance =
					document.documentElement.scrollHeight - document.documentElement.clientHeight;
				$progress = (scrollY * 100) / total_scroll_distance;
			});
		}
	}
	$: meets_visibility_threshold = $progress >= threshold;
</script>

<svelte:window bind:scrollY on:scroll={checkScrollProgress} />
{#if meets_visibility_threshold}
	{#if show_return_to_top_button}
		<Button {...button_props} on:click={() => window?.scrollTo({ top: 0, behavior: 'smooth' })}>
			<slot />
		</Button>
	{/if}
	{#if show_progress_bar}
		<progress-indicator style="width:{($progress * 100).toString()}%;" />
	{:else if show_progress_radial}
		<progress-indicator-radial style="--radii:{($progress * 100).toString()}%" />
	{/if}
{/if}

<style lang="scss">
	$radii: var(--radii);

	progress-indicator {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 5px;
		z-index: var(--progress-indicator-z-index);
		background-color: var(--progress-indicator-background-color, inherit);
		&-radial {
			top: 50vh;
			left: 1rem;
			width: 10rem;
			aspect-ratio: 1/1;
			border-radius: 50%;
			background: conic-gradient(
				var(--progress-indicator-background-color) $radii,
				transparent $radii
			);
		}
	}
</style>
