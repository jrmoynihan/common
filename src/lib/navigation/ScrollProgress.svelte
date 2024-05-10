<script lang="ts">
	import { browser } from '$app/environment';
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import { spring, type Spring } from 'svelte/motion';

	interface ScrollProgressProps {
		children?: Snippet
		button_props?: ComponentProps<ButtonRunes>
		/** The percent at which the scroll-to-top button becomes visible.  E.g., 10% would be 10*/
		threshold?: number
		/** The scroll progess up and down the page, expressed as a percent. */
		progress?: Spring<number>
		/** Should a return-to-top button be shown when the scroll progress passes the given threshold? */
		show_return_to_top_button?: boolean
		/** Should a scroll progess bar be displayed on the page? */
		show_progress_bar?: boolean
		/** Should a conical radial display the scroll progress on the page? */
		show_progress_radial?: boolean
	}

	let {
		children,
		button_props,
		threshold = 10,
		progress = spring<number>(0, { damping: 0.5, stiffness: 0.1 }),
		show_return_to_top_button = true,
		show_progress_bar = false,
		show_progress_radial = false

	} : ScrollProgressProps = $props();

	/** The scroll distance donw the page */
	let scrollY: number = $state(0);
	/** If the progress indicators or scroll-to-top button meet the scroll percentage threshold to become visible */
	let meets_visibility_threshold: boolean = $state(false);

	function checkScrollProgress() {
		if (browser) {
			window.requestAnimationFrame(() => {
				const total_scroll_distance =
					document.documentElement.scrollHeight - document.documentElement.clientHeight;
				$progress = (scrollY * 100) / total_scroll_distance;
			});
		}
	}
	function onclick(){
		window?.scrollTo({ top: 0, behavior: 'smooth' })
	}

	$effect(()=> {
		meets_visibility_threshold = $progress >= threshold;
	}) 
</script>

<svelte:window bind:scrollY on:scroll={checkScrollProgress} />
{#if meets_visibility_threshold}
	{#if show_return_to_top_button}
		<ButtonRunes {...button_props} {onclick} >
			{#if children}
				{@render children()}
			{/if}
		</ButtonRunes>
	{/if}
	{#if show_progress_bar}
		<progress-indicator style="width:{($progress * 100).toString()}%;">
		</progress-indicator>
	{:else if show_progress_radial}
		<progress-indicator-radial style="--radii:{($progress * 100).toString()}%">
		</progress-indicator-radial>
	{/if}
{/if}

<style>
	progress-indicator, progress-indicator-radial {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 5px;
		z-index: var(--progress-indicator-z-index);
		background-color: var(--progress-indicator-background-color, inherit);
	}
	progress-indicator-radial {
		top: 50vh;
		left: 1rem;
		width: 10rem;
		aspect-ratio: 1/1;
		border-radius: 50%;
		background: conic-gradient(
			var(--progress-indicator-background-color) var(--radii),
			transparent var(--radii)
		);
	}
</style>
