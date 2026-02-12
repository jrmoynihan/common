<script module lang="ts">
	export interface ScrollProgressProps {
		children?: Snippet;
		/** The attributes to apply to the button that scrolls to the top of the page. */
		button_attributes?: HTMLButtonAttributes;
		/** The percent at which the scroll-to-top button becomes visible.  E.g., 10% would be 10*/
		threshold?: number;
		/** The scroll progess up and down the page, expressed as a percent. */
		progress?: Spring<number>;
		/** Should a return-to-top button be shown when the scroll progress passes the given threshold? */
		show_return_to_top_button?: boolean;
		/** Should a scroll progess bar be displayed on the page? */
		show_progress_bar?: boolean;
		/** Should a conical radial display the scroll progress on the page? */
		show_progress_radial?: boolean;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
	import { Spring } from 'svelte/motion';

	let {
		children,
		button_attributes,
		threshold = 10,
		progress = new Spring<number>(0, { damping: 0.5, stiffness: 0.1 }),
		show_return_to_top_button = true,
		show_progress_bar = false,
		show_progress_radial = false
	}: ScrollProgressProps = $props();

	/** The scroll distance donw the page */
	let scrollY: number = $state(0);
	/** If the progress indicators or scroll-to-top button meet the scroll percentage threshold to become visible */
	let meets_visibility_threshold: boolean = $state(false);

	// TODO: just extend the Spring class to add a `toPercent` method

	function checkScrollProgress() {
		if (browser) {
			window.requestAnimationFrame(() => {
				const total_scroll_distance =
					document.documentElement.scrollHeight - document.documentElement.clientHeight;
				progress.set((scrollY * 100) / total_scroll_distance);
			});
		}
	}
	const onclick: MouseEventHandler<HTMLButtonElement> = (e) => {
		window?.scrollTo({ top: 0, behavior: 'smooth' });
		button_attributes?.onclick?.(e);
	};

	$effect(() => {
		meets_visibility_threshold = progress.current >= threshold;
	});
</script>

<svelte:window bind:scrollY on:scroll={checkScrollProgress} />
{#if meets_visibility_threshold}
	{#if show_return_to_top_button}
		<button {onclick} {...button_attributes}>
			{@render children?.()}
		</button>
	{/if}
	{#if show_progress_bar}
		<progress-indicator style="width:{(progress.current * 100).toString()}%;"> </progress-indicator>
	{:else if show_progress_radial}
		<progress-indicator-radial style="--radii:{(progress.current * 100).toString()}%">
		</progress-indicator-radial>
	{/if}
{/if}

<style>
	progress-indicator,
	progress-indicator-radial {
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
