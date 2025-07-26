<script lang="ts" module>
	export { carousel_item };

	type Index = number;
	// Base interface with common properties
	interface CarouselPropsBase {
		items?: any[];
		next_content?: Snippet;
		previous_content?: Snippet;
		pagination_type?: 'dots' | 'gallery' | 'none';
		length?: number;
		start_index?: number;
		/** Which the carousel is scrolled to currently.  Changes during scroll events.*/
		current_index?: number;
		/** The actual item selected by the user.  Changes when the user clicks on a marker or arrow button. */
		selected_index?: number;
		show_arrows?: boolean;
		disable_previous?: boolean;
		disable_next?: boolean;
		show_previous?: boolean;
		show_next?: boolean;
		previous_attributes?: HTMLButtonAttributes;
		next_attributes?: HTMLButtonAttributes;
		carousel_attributes?: HTMLAttributes<HTMLDivElement>;
		arrow_controls_container_attributes?: HTMLAttributes<HTMLDivElement>;
		scroller_attributes?: HTMLAttributes<HTMLDivElement>;
		pagination_attributes?: HTMLAttributes<HTMLElement>;
		carousel_item_attributes?: HTMLAttributes<HTMLDivElement>;
		marker_attributes?: HTMLButtonAttributes;
		on_item_change?: (index: number, element: HTMLElement) => void;
		on_navigation?: (direction: 'next' | 'previous', index: number) => void;
	}

	// Conditional type that requires item_snippet when children is not provided
	export type CarouselProps = CarouselPropsBase &
		(
			| { children: Snippet; item_snippet?: Snippet<[any, Index]> }
			| { children?: undefined; item_snippet: Snippet<[any, Index]> }
		);
</script>

<script lang="ts">
	import { browser } from '$app/environment';

	// Adapted from https://web.dev/patterns/components/carousel/#js
	// import { scrollend } from 'https://cdn.jsdelivr.net/gh/argyleink/scrollyfills@latest/dist/scrollyfills.modern.js';
	import { type Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		items = [],
		item_snippet,
		children,
		next_content = default_next_content,
		previous_content = default_previous_content,
		pagination_type = 'dots',
		length = 0,
		start_index = 0,
		current_index = $bindable(0),
		selected_index = $bindable(0),
		show_arrows = true,
		disable_previous = false,
		disable_next = false,
		show_previous = true,
		show_next = true,
		previous_attributes,
		next_attributes,
		on_item_change,
		on_navigation,
		carousel_attributes,
		arrow_controls_container_attributes,
		scroller_attributes,
		pagination_attributes,
		carousel_item_attributes,
		marker_attributes
	}: CarouselProps = $props();

	// Determine the actual number of items
	const item_count = $derived.by(() => {
		if (items.length > 0) {
			return items.length;
		}
		if (length > 0) {
			return length;
		}
		// If using children, we need to count the carousel items in the DOM
		if (children) {
			console.warn('Carousel: `length` should be set when passing `children` snippets.');
		}
		return 0; // Will be updated by effect
	});

	// State management with runes
	let current = $state<HTMLElement>();
	let previous = $state<HTMLButtonElement>();
	let next = $state<HTMLButtonElement>();
	let carousel = $state<HTMLElement>();
	let scroller = $state<HTMLElement>();
	let pagination_nav = $state<HTMLElement>();
	let marker_moving = $state(false);
	// State for intersection observations
	let intersectionObservations = $state<IntersectionObserverEntry[]>([]);
	const is_at_end = $derived(current_index === item_count - 1);
	const is_at_start = $derived(current_index === 0);
	const can_go_next = $derived(!disable_next && !is_at_end && item_count > 1);
	const can_go_previous = $derived(!disable_previous && !is_at_start && item_count > 1);

	// Observers
	let carousel_observer: IntersectionObserver;
	let mutation_observer: MutationObserver;

	// Helper function to get carousel items from DOM
	function get_carousel_items(): HTMLElement[] {
		if (!scroller) return [];
		return Array.from(scroller.querySelectorAll('.gui-carousel-item.snap')) as HTMLElement[];
	}

	// Initialize observers
	$effect(() => {
		if (scroller) {
			carousel_observer = new IntersectionObserver(
				(observations) => {
					// Update class names for visual feedback
					for (let observation of observations) {
						observation.target.classList.toggle('--in-view', observation.isIntersecting);
					}

					// Update intersection observations state
					intersectionObservations = observations;
				},
				{
					root: scroller,
					threshold: 0.6
				}
			);

			// Observe all carousel items
			get_carousel_items()?.forEach((item) => carousel_observer.observe(item));
		}

		return () => {
			get_carousel_items()?.forEach((item) => carousel_observer.unobserve(item));
		};
	});

	// Mutation observer for cleanup
	$effect(() => {
		if (carousel) {
			mutation_observer = new MutationObserver((mutationList) => {
				mutationList
					.filter((x) => x.removedNodes.length > 0)
					.forEach((mutation) => {
						[...mutation.removedNodes]
							.filter((x) => x.nodeType === Node.ELEMENT_NODE)
							.filter((x) => (x as HTMLElement).querySelector?.('.gui-carousel') === carousel)
							.forEach(() => {
								// Carousel was removed, cleanup observers
								if (carousel_observer) {
									get_carousel_items()?.forEach((item) => carousel_observer.unobserve(item));
								}
							});
					});
			});

			mutation_observer.observe(document, {
				childList: true,
				subtree: true
			});
		}
		return () => mutation_observer.disconnect();
	});

	// Update current item and pagination based on intersection observations
	$effect(() => {
		// Find the most centered/primary intersecting item
		let primary_intersection: IntersectionObserverEntry | null = null;
		let max_intersection_ratio = 0;

		for (let observation of intersectionObservations) {
			observation.target.toggleAttribute('inert', !observation.isIntersecting);

			if (observation.isIntersecting && observation.intersectionRatio > max_intersection_ratio) {
				max_intersection_ratio = observation.intersectionRatio;
				primary_intersection = observation;
			}
		}

		// Update current item and pagination for the primary intersection
		if (primary_intersection) {
			const new_index = get_element_index(primary_intersection.target);
			current_index = new_index; // Will result in markers getting highlighted during scroll

			// Call on_item_change callback
			on_item_change?.(new_index, primary_intersection.target as HTMLElement);

			// Update pagination dots
			update_pagination_dots(new_index);
		}
	});

	// Helper function to update pagination dots
	function update_pagination_dots(index: number) {
		const dot = pagination_nav?.children[index];
		if (dot) {
			dot.setAttribute('aria-selected', (selected_index === index).toString());
			dot.setAttribute('tabindex', selected_index === index ? '0' : '-1');
		}
	}

	// Initialize current item and re-initialize when item count changes
	$effect(() => {
		if (scroller && item_count) {
			const carousel_items = get_carousel_items();
			// Re-initialize if no current item or if item count changed significantly
			if (!current || carousel_items.length !== item_count) {
				if (carousel_items[start_index]) {
					current = carousel_items[start_index];
					current_index = start_index;
				}
			}
		}
	});

	// Handle focus management when buttons become disabled
	$effect(() => {
		if (browser && document?.activeElement === next && !can_go_next) {
			previous?.focus();
		} else if (browser && document?.activeElement === previous && !can_go_previous) {
			next?.focus();
		}
	});

	function handle_paginate(event: Event, index: number) {
		const target_element = event.target as HTMLElement;
		if (!target_element || target_element.classList.contains('gui-carousel-pagination')) return;

		// // Get the index from the marker's position within the pagination nav
		// const marker_index = Array.from(pagination_nav?.children || []).indexOf(target_element);
		// if (marker_index === -1) return;

		const carousel_items = get_carousel_items();
		const element = carousel_items[index];
		if (element && scroller) {
			current = element;
			selected_index = index;

			// Call on_item_change callback
			on_item_change?.(index, element);

			// Update pagination dots
			update_pagination_dots(index);

			element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
		}
	}

	function synchronize() {
		// Process intersection observations when scroll ends
		for (let observation of intersectionObservations) {
			observation.target.toggleAttribute('inert', !observation.isIntersecting);
		}
		// Clear observations after processing
		intersectionObservations = [];
		marker_moving = false;
	}

	function get_element_index(element: Element) {
		let index = 0;
		while ((element = element.previousElementSibling as HTMLElement)) index++;
		return index;
	}

	export function go_next(event: Event) {
		if (!can_go_next || !current || !scroller) return;

		const next_item = current.nextElementSibling as HTMLElement;
		if (current === next_item) return;

		if (next_item) {
			const new_index = get_element_index(next_item);
			selected_index = new_index;
			current = next_item;

			handle_paginate(event, new_index);
			next_item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

			// Call on_navigation callback
			on_navigation?.('next', new_index);
		} else {
			console.log('No next item found');
		}
	}

	export function go_previous(event: Event) {
		if (!can_go_previous || !current || !scroller) return;

		const previous_item = current.previousElementSibling as HTMLElement;
		if (current === previous_item) return;

		if (previous_item) {
			const new_index = get_element_index(previous_item);
			selected_index = new_index;
			current = previous_item;

			handle_paginate(event, new_index);
			previous_item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

			// Call on_navigation callback
			on_navigation?.('previous', new_index);
		} else {
			console.log('No previous item found');
		}
	}

	function document_direction() {
		return document?.firstElementChild?.getAttribute('dir') || 'ltr';
	}

	function handle_keydown(e: KeyboardEvent) {
		const dir = document_direction();
		const idx = get_element_index(e.target as Element);

		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();

				const next_offset = dir === 'ltr' ? 1 : -1;
				const next_control = dir === 'ltr' ? next : previous;

				if ((e.target as HTMLElement).closest('.gui-carousel-pagination'))
					(pagination_nav?.children[idx + next_offset] as HTMLElement)?.focus();
				else {
					if (document.activeElement === next_control) keypress_animation(next_control);
					next_control?.focus();
				}

				dir === 'ltr' ? go_next(e) : go_previous(e);
				break;
			case 'ArrowLeft':
				e.preventDefault();

				const previous_offset = dir === 'ltr' ? -1 : 1;
				const previous_control = dir === 'ltr' ? previous : next;

				if ((e.target as HTMLElement).closest('.gui-carousel-pagination'))
					(pagination_nav?.children[idx + previous_offset] as HTMLElement)?.focus();
				else {
					if (document.activeElement === previous_control) keypress_animation(previous_control);
					previous_control?.focus();
				}

				dir === 'ltr' ? go_previous(e) : go_next(e);
				break;
		}
	}

	function keypress_animation(element: HTMLElement) {
		element.style.animation = 'gui-carousel--control-keypress 145ms var(--ease-2)';
		element.addEventListener(
			'animationend',
			() => {
				element.style.animation = '';
			},
			{ once: true }
		);
	}

	export const handle_scroll_start = (event: AnimationEvent, i: number) => {
		if (i === start_index && scroller) {
			const carousel_items = get_carousel_items();
			carousel_items.forEach((item) => {
				if (item instanceof HTMLElement) {
					item.style.scrollSnapAlign = '';
				}
			});
		}
	};
</script>

{#snippet default_next_content()}
	<svg
		aria-hidden="true"
		viewBox="0 0 20 20"
		fill="currentColor"
		style="inline-size: var(--size-8);"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
		></path>
	</svg>
{/snippet}
{#snippet default_previous_content()}
	<svg
		aria-hidden="true"
		viewBox="0 0 20 20"
		fill="currentColor"
		style="inline-size: var(--size-8);"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
		></path>
	</svg>
{/snippet}

<!--svelte-ignore a11y_no_noninteractive_element_interactions-->
<div
	bind:this={carousel}
	onkeydown={handle_keydown}
	tabindex="-1"
	role="region"
	aria-roledescription="carousel"
	data-carousel-pagination={pagination_type}
	data-carousel-controls="auto"
	data-carousel-scrollbar="auto"
	data-carousel-snapstop="auto"
	aria-label="Featured Items Carousel"
	{...carousel_attributes}
	class={[
		'gui-carousel',
		pagination_type === 'none' ? 'no-pagination' : 'pagination',
		carousel_attributes?.class
	]}
>
	{#if show_arrows}
		<div class="arrow-controls" {...arrow_controls_container_attributes}>
			{#if show_previous}
				<button
					bind:this={previous}
					disabled={!can_go_previous}
					type="button"
					title="Previous Item"
					class={[
						'carousel-control arrow previous',
						is_at_start && 'start',
						previous_attributes?.class
					]}
					aria-controls="arrow-controls"
					aria-label="Previous Item"
					onclick={go_previous}
					{...previous_attributes}
				>
					{@render previous_content()}
				</button>
			{/if}
			{#if show_next}
				<button
					bind:this={next}
					disabled={!can_go_next}
					type="button"
					title="Next Item"
					class={['carousel-control arrow next', is_at_end && 'end', next_attributes?.class]}
					aria-controls="arrow-controls"
					aria-label="Next Item"
					onclick={go_next}
					{...next_attributes}
				>
					{@render next_content()}
				</button>
			{/if}
		</div>
	{/if}
	<div
		bind:this={scroller}
		onscrollend={synchronize}
		role="group"
		aria-label="Items Scroller"
		aria-live="polite"
		{...scroller_attributes}
		class={['gui-carousel--scroller', scroller_attributes?.class]}
	>
		{#each items as item, i (i)}
			<div
				class="gui-carousel-item snap"
				aria-label={`${i + 1} of ${item_count}`}
				aria-roledescription="item"
				style:animation={i === start_index ? 'carousel-scrollstart 1ms' : ''}
				onanimationend={(e) => handle_scroll_start(e, i)}
			>
				{@render item_snippet?.(item, i)}
			</div>
		{/each}
		{@render children?.()}
	</div>

	{#if pagination_type !== 'none' && item_count > 1}
		<nav
			bind:this={pagination_nav}
			{...pagination_attributes}
			class={['pagination', pagination_attributes?.class]}
		>
			{#each Array.from({ length: item_count }) as _, i}
				{@render marker(i)}
			{/each}
		</nav>
	{/if}
</div>

{#snippet carousel_item({
	index,
	content,
	start_index = 0,
	onanimationend
}: {
	index: number;
	content: Snippet<[Index]>;
	start_index?: number;
	onanimationend?: (e: AnimationEvent, i: number) => void;
})}
	<div
		class="gui-carousel-item snap"
		aria-label={`${index + 1}`}
		aria-roledescription="item"
		style:animation={index === start_index ? 'carousel-scrollstart 1ms' : ''}
		onanimationend={(e) => onanimationend?.(e, index)}
	>
		{@render content?.(index)}
	</div>
{/snippet}

{#snippet marker(index: number)}
	{#if pagination_type === 'dots'}
		{@render marker_dot(index)} <!-- User-facing index should be 1-based -->
	{:else if pagination_type === 'gallery'}
		{@render marker_gallery(index)} <!-- User-facing index should be 1-based -->
	{/if}
{/snippet}

{#snippet marker_dot(index: number)}
	{@const carousel_items = get_carousel_items()}
	{@const itemElement = carousel_items[index]}
	{@const img = itemElement?.querySelector('img')}
	{@const caption = itemElement?.querySelector('figcaption')}
	<button
		onpointerdown={(e) => handle_paginate(e, index)}
		type="button"
		role="tab"
		title={`Item ${index}: ${img?.alt || caption?.innerText || ''}`}
		class={['carousel-control marker dot', marker_attributes?.class]}
		aria-selected={index === current_index}
		aria-label={img?.alt || caption?.innerText || `Item ${index}`}
		aria-setsize={item_count}
		aria-posinset={index}
		aria-controls={`carousel-item-${index}`}
		{...marker_attributes}
	>
	</button>
{/snippet}

{#snippet marker_gallery(index: number)}
	{@const carousel_items = get_carousel_items()}
	{@const itemElement = carousel_items[index]}
	{@const img = itemElement?.querySelector('img')}
	<button
		type="button"
		onpointerdown={(e) => handle_paginate(e, index)}
		style:background-image={img?.src ? `url(${img.src})` : undefined}
		title={`Item ${index}: ${img?.alt || ''}`}
		class={['carousel-control marker gallery', marker_attributes?.class]}
		aria-label={img?.alt || `Item ${index}`}
		aria-controls={`carousel-item-${index}`}
		{...marker_attributes}
	>
	</button>
{/snippet}

<style>
	.gui-carousel {
		--_carousel-item-size: 80%;
		--_carousel-gutters: max(4rem, calc((100% - var(--_carousel-item-size)) / 2));
		--_carousel-scrollbar-gutter: var(--size-6);
		--_carousel-pagination-size: var(--size-8);

		display: grid;
		grid-template-columns: [carousel-gutter] var(--_carousel-gutters) 1fr [carousel-gutter] var(
				--_carousel-gutters
			);
		grid-template-rows:
			[carousel-scroller] 1fr
			[carousel-pagination] var(--_carousel-pagination-size);

		&:focus-visible {
			outline-offset: -5px;
		}

		/* configuration handlers */
		&[data-carousel-pagination='gallery'] {
			--_carousel-pagination-size: var(--size-10);

			& > nav.pagination {
				mask-image: linear-gradient(to right, #0000 0%, #000 5%, 95%, #000, #0000);
				-webkit-mask-image: linear-gradient(to right, #0000 0%, #000 5%, 95%, #000, #0000);
			}
		}

		&[data-carousel-pagination='none'] {
			grid-template-rows: [carousel-scroller] 1fr;

			& > nav.pagination {
				display: none;
			}
		}

		&:global([data-carousel-controls='none']) {
			grid-template-columns: 0 1fr 0;

			& > .arrow-controls {
				display: none;
			}
		}

		&:global([data-carousel-scrollbar='none']) {
			--_carousel-pagination-size: var(--size-5);

			& > .gui-carousel--scroller {
				scrollbar-width: none;

				&::-webkit-scrollbar {
					display: none;
				}
			}

			& > nav.pagination {
				place-self: start center;
			}
		}

		&:global([data-carousel-snapstop='always']) .gui-carousel-item.snap {
			scroll-snap-stop: always;
		}
	}

	.gui-carousel--scroller {
		grid-row: 1;
		grid-column: 1/-1;

		display: grid;
		grid-auto-columns: 100%;
		grid-auto-flow: column;
		align-items: center;
		gap: var(--_carousel-gutters);

		padding-block: var(--size-2) var(--_carousel-scrollbar-gutter);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x proximity;
		scroll-padding-inline: var(--_carousel-gutters);
		padding-inline: var(--_carousel-gutters);

		@media (--motionOK) {
			scroll-behavior: smooth;
		}
	}

	.gui-carousel-item.snap {
		scroll-snap-align: center;
	}

	.arrow-controls {
		display: flex;
		justify-content: space-between;
		padding-inline: var(--_carousel-gutters);
		display: contents;

		& > .carousel-control.arrow {
			/* margin-block-end: var(--_carousel-scrollbar-gutter); */ /* not sure I really need this */
			transition: transform 0.2s var(--ease-4);

			&:not(:disabled):active {
				transform: scale(0.9);
			}
		}
	}

	.carousel-control {
		--_shadow-size: 0;
		--_shadow-highlight-light: hsl(0 0% 50% / 10%);
		--_shadow-highlight-dark: hsl(0 0% 100% / 20%);
		--_shadow-highlight: var(--_shadow-highlight-light);

		grid-row: 1;
		place-self: center;
		background: var(--surface-1);
		color: var(--text-2);
		aspect-ratio: var(--ratio-square);
		border-radius: var(--radius-round);
		box-shadow: 0 0 0 var(--_shadow-size) var(--_shadow-highlight);
		border: var(--border-size-1) solid transparent;
		/* text-indent: 10ch;  what is this doing for the SVG?? */
		/* overflow: hidden; */
		padding: 0;
		z-index: var(--layer-1);
		transition: opacity 0.5s var(--ease-2) 0.5s;

		@media (--motionOK) {
			transition:
				opacity 0.5s var(--ease-2) 0.5s,
				transform 0.2s var(--ease-4),
				box-shadow 0.2s var(--ease-4),
				outline-offset 145ms var(--ease-2);
		}

		@media (--OSdark) {
			--_shadow-highlight: var(--_shadow-highlight-dark);
		}

		&:hover {
			--_shadow-size: 6px;
		}

		&.previous {
			grid-column: 1;
		}

		&.next {
			grid-column: 3;
		}

		[dir='rtl'] & > svg {
			transform: rotateY(180deg);
		}

		&:disabled,
		&:disabled > svg {
			cursor: not-allowed;
			transition-delay: 0s;
			opacity: 0.25;
		}

		&:not(:disabled):is(:hover, :focus-visible) {
			color: var(--link);
		}

		&:not(:disabled) svg > path {
			@media (--motionOK) {
				--_transform: translateX(var(--_x)) scale(0.95);
				transition: transform 0.5s var(--ease-squish-3);
				transform-origin: center center;
			}
		}

		&:global([aria-label='Next Item']):not(:disabled):is(:hover, :focus-visible) svg > path {
			--_x: 2px;
			transform: var(--_transform);
		}

		&:global([aria-label='Previous Item']):not(:disabled):is(:hover, :focus-visible) svg > path {
			--_x: -2px;
			transform: var(--_transform);
		}

		&.marker {
			inline-size: var(--size-3);
			border: var(--border-size-1) solid transparent;
			background-color: var(--color-gray-500);
			transition:
				transform 0.2s var(--ease-4),
				background-color 0.2s var(--ease-4);
			&:where([aria-selected='true']) {
				background: var(--color-gray-900);
				transform: scale(1.2);
				@media (prefers-color-scheme: dark) {
					background: var(--color-gray-200);
				}
			}

			&:where([aria-selected='false']) {
				/* transform: scale(0.75); */
			}

			&.gallery {
				inline-size: var(--size-fluid-5);
				border-radius: var(--radius-2);
				border: none;
				background-origin: border-box;
				background-size: cover;
			}
		}
	}

	nav.pagination {
		grid-column: 1/-1;
		place-self: center;

		display: grid;
		grid-auto-flow: column;
		gap: var(--size-2);

		max-inline-size: 100%;
		overflow-x: auto;
		overscroll-behavior-x: contain;

		padding-block: var(--size-2);
		padding-inline: var(--size-4);

		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		@media (--motionOK) {
			scroll-behavior: smooth;
		}

		:where([data-carousel-pagination='gallery']) & {
			margin-block-end: 0;
		}
	}

	@keyframes gui-carousel--control-keypress {
		0% {
			outline-offset: 5px;
		}
		50% {
			outline-offset: 0;
		}
	}

	@keyframes carousel-scrollstart {
		from {
			scroll-snap-align: center;
		}
		to {
			scroll-snap-align: unset;
		}
	}
</style>
