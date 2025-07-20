<script lang="ts" module>
	export { carousel_item };
	type Index = number;
	export interface CarouselProps {
		items?: any[];
		item_snippet?: Snippet<[any, Index]>;
		children?: Snippet;
		next_content?: Snippet;
		previous_content?: Snippet;
		pagination_type?: 'dots' | 'gallery' | 'none';
		length?: number;
		start_index?: number;
		show_arrows?: boolean;
		disable_previous?: boolean;
		disable_next?: boolean;
		show_previous?: boolean;
		show_next?: boolean;
		previous_attributes?: HTMLButtonAttributes;
		next_attributes?: HTMLButtonAttributes;
	}
</script>

<script lang="ts">
	// Adapted from https://web.dev/patterns/components/carousel/#js
	// import { scrollend } from 'https://cdn.jsdelivr.net/gh/argyleink/scrollyfills@latest/dist/scrollyfills.modern.js';
	import { type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		items,
		item_snippet,
		children,
		next_content = default_next_content,
		previous_content = default_previous_content,
		pagination_type = 'dots',
		length = 0,
		start_index = 0,
		show_arrows = true,
		disable_previous = false,
		disable_next = false,
		show_previous = true,
		show_next = true,
		previous_attributes,
		next_attributes
	}: CarouselProps = $props();

	// Determine the actual number of items
	const item_count = $derived.by(() => {
		if (items && items.length > 0) {
			return items.length;
		}
		if (length > 0) {
			return length;
		}
		// If using children, we need to count the carousel items in the DOM
		if (children) {
			console.warn('Carousel: length is not set when using children');
		}
		return 0; // Will be updated by effect
	});

	// State management with runes
	let current = $state<HTMLElement>();
	let current_index = $state<number>(0);
	let previous = $state<HTMLButtonElement>();
	let next = $state<HTMLButtonElement>();
	let carousel = $state<HTMLElement>();
	let scroller = $state<HTMLElement>();
	let pagination_nav = $state<HTMLElement>();
	let has_intersected = $state<Set<IntersectionObserverEntry>>(new Set());
	const is_at_end = $derived(current === (scroller?.lastElementChild as HTMLElement));
	const is_at_start = $derived(current === (scroller?.firstElementChild as HTMLElement));
	$effect(() => {
		if (document?.activeElement === next && is_at_end) previous?.focus();
		else if (document?.activeElement === previous && is_at_start) next?.focus();
	});

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
					for (let observation of observations) {
						has_intersected.add(observation);
						observation.target.classList.toggle('--in-view', observation.isIntersecting);
					}
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

	// Synchronize intersection observations
	$effect(() => {
		for (let observation of has_intersected) {
			observation.target.toggleAttribute('inert', !observation.isIntersecting);
			const dot = pagination_nav?.children[get_element_index(observation.target)];
			dot?.setAttribute('aria-selected', observation.isIntersecting.toString());
			dot?.setAttribute('tabindex', !observation.isIntersecting ? '-1' : '0');

			if (observation.isIntersecting) {
				current = observation.target as HTMLElement;
				current_index = get_element_index(observation.target);

				const dot = pagination_nav?.children[get_element_index(observation.target)];
				if (dot && pagination_nav) {
					go_to_element({
						scrollport: pagination_nav,
						element: dot as HTMLElement
					});
				}
			}
		}

		has_intersected.clear();
	});

	// Initialize current item only once
	$effect(() => {
		if (scroller && item_count && !current) {
			const carousel_items = get_carousel_items();
			if (carousel_items[start_index]) {
				current = carousel_items[start_index];
			}
		}
	});

	function handle_paginate(event: PointerEvent) {
		const target_element = event.target as HTMLElement;
		if (!target_element || target_element.classList.contains('gui-carousel-pagination')) return;

		target_element.setAttribute('aria-selected', 'true');
		const carousel_items = get_carousel_items();
		const element = carousel_items[get_element_index(target_element)];
		if (element && scroller) {
			go_to_element({ scrollport: scroller, element });
		}
	}

	function synchronize() {
		for (let observation of has_intersected) {
			observation.target.toggleAttribute('inert', !observation.isIntersecting);
			// toggle aria-selected on pagination dots
			const dot = pagination_nav?.children[get_element_index(observation.target)];

			dot?.setAttribute('aria-selected', observation.isIntersecting.toString());
			dot?.setAttribute('tabindex', !observation.isIntersecting ? '-1' : '0');
		}
		has_intersected.clear();
	}

	function get_element_index(element: Element) {
		let index = 0;
		while ((element = element.previousElementSibling as HTMLElement)) index++;
		return index;
	}

	export function go_next() {
		if (!current || !scroller) return;

		const next_item = current.nextElementSibling as HTMLElement;
		if (current === next_item) return;

		if (next_item) {
			current = next_item;
			go_to_element({
				scrollport: scroller,
				element: next_item
			});
		} else {
			console.log('No next item found');
		}
	}

	export function go_previous() {
		if (!current || !scroller) return;

		const previous_item = current.previousElementSibling as HTMLElement;
		if (current === previous_item) return;

		if (previous_item) {
			current = previous_item;
			go_to_element({
				scrollport: scroller,
				element: previous_item
			});
		} else {
			console.log('No previous item found');
		}
	}

	function go_to_element({
		scrollport,
		element
	}: {
		scrollport: HTMLElement;
		element: HTMLElement;
	}) {
		// Temporarily disable scroll snap to allow smooth scrolling
		const originalScrollSnapType = scrollport.style.scrollSnapType;
		scrollport.style.scrollSnapType = 'none';

		// Calculate scroll position to center the element
		const scrollportRect = scrollport.getBoundingClientRect();
		const elementRect = element.getBoundingClientRect();
		const scrollLeft = scrollport.scrollLeft;

		// Calculate the position to center the element
		const targetScrollLeft =
			scrollLeft +
			(elementRect.left - scrollportRect.left) -
			(scrollportRect.width - elementRect.width) / 2;

		scrollport.scrollTo({
			left: targetScrollLeft,
			top: 0,
			behavior: 'smooth'
		});

		// Re-enable scroll snap after animation
		setTimeout(() => {
			scrollport.style.scrollSnapType = originalScrollSnapType || 'x proximity';
		}, 500);
	}

	function document_direction() {
		return document?.firstElementChild?.getAttribute('dir') || 'ltr';
	}

	function handle_keydown(event: KeyboardEvent) {
		const dir = document_direction();
		const idx = get_element_index(event.target as Element);

		switch (event.key) {
			case 'ArrowRight':
				event.preventDefault();

				const next_offset = dir === 'ltr' ? 1 : -1;
				const next_control = dir === 'ltr' ? next : previous;

				if ((event.target as HTMLElement).closest('.gui-carousel-pagination'))
					(pagination_nav?.children[idx + next_offset] as HTMLElement)?.focus();
				else {
					if (document.activeElement === next_control) keypress_animation(next_control);
					next_control?.focus();
				}

				dir === 'ltr' ? go_next() : go_previous();
				break;
			case 'ArrowLeft':
				event.preventDefault();

				const previous_offset = dir === 'ltr' ? -1 : 1;
				const previous_control = dir === 'ltr' ? previous : next;

				if ((event.target as HTMLElement).closest('.gui-carousel-pagination'))
					(pagination_nav?.children[idx + previous_offset] as HTMLElement)?.focus();
				else {
					if (document.activeElement === previous_control) keypress_animation(previous_control);
					previous_control?.focus();
				}

				dir === 'ltr' ? go_previous() : go_next();
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

	// function update_controls() {
	// 	if (!scroller || !next || !previous) return;

	// 	const { lastElementChild: last, firstElementChild: first } = scroller;

	// 	const isAtEnd = current === last;
	// 	const isAtStart = current === first;

	// 	// before we possibly disable a button
	// 	// shift the focus to the complimentary button
	// 	if (document.activeElement === next && isAtEnd) previous.focus();
	// 	else if (document.activeElement === previous && isAtStart) next.focus();

	// 	next.toggleAttribute('disabled', isAtEnd);
	// 	previous.toggleAttribute('disabled', isAtStart);
	// }

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
	class={['gui-carousel', pagination_type === 'none' ? 'no-pagination' : 'pagination']}
	tabindex="-1"
	role="region"
	aria-roledescription="carousel"
	data-carousel-pagination={pagination_type}
	data-carousel-controls="auto"
	data-carousel-scrollbar="auto"
	data-carousel-snapstop="auto"
	aria-label="Featured Items Carousel"
>
	{#if show_arrows}
		<div class="arrow-controls">
			{#if show_previous}
				<button
					bind:this={previous}
					disabled={disable_previous || is_at_start}
					type="button"
					title="Previous Item"
					class={[
						'carousel-control arrow previous',
						is_at_start && 'start',
						previous_attributes?.class
					]}
					aria-controls="arrow-controls"
					aria-label="Previous Item"
					onclick={() => {
						console.log('Previous button clicked');
						go_previous();
					}}
					{...previous_attributes}
				>
					{@render previous_content()}
				</button>
			{/if}
			{#if show_next}
				<button
					bind:this={next}
					disabled={disable_next || is_at_end}
					type="button"
					title="Next Item"
					class={['carousel-control arrow next', is_at_end && 'end', next_attributes?.class]}
					aria-controls="arrow-controls"
					aria-label="Next Item"
					onclick={() => {
						console.log('Next button clicked');
						go_next();
					}}
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
		class="gui-carousel--scroller"
		role="group"
		aria-label="Items Scroller"
		aria-live="polite"
	>
		{#if items && items.length > 0 && item_snippet}
			{#each items as item, i}
				<div
					class="gui-carousel-item snap"
					aria-label={`${i + 1} of ${item_count}`}
					aria-roledescription="item"
					style:animation={i === start_index ? 'carousel-scrollstart 1ms' : ''}
					onanimationend={(e) => handle_scroll_start(e, i)}
				>
					{@render item_snippet(item, i)}
				</div>
			{/each}
		{:else}
			{@render children?.()}
		{/if}
	</div>

	{#if pagination_type !== 'none' && item_count > 1}
		<nav bind:this={pagination_nav} class="pagination" onpointerdown={handle_paginate}>
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
		{@render marker_dot(index + 1)} <!-- User-facing index should be 1-based -->
	{:else if pagination_type === 'gallery'}
		{@render marker_gallery(index + 1)} <!-- User-facing index should be 1-based -->
	{/if}
{/snippet}

{#snippet marker_dot(index: number)}
	{@const carousel_items = get_carousel_items()}
	{@const itemElement = carousel_items[index - 1]}
	{@const img = itemElement?.querySelector('img')}
	{@const caption = itemElement?.querySelector('figcaption')}
	<button
		type="button"
		role="tab"
		title={`Item ${index}: ${img?.alt || caption?.innerText || ''}`}
		class="carousel-control marker dot"
		aria-selected={index === current_index}
		aria-label={img?.alt || caption?.innerText || `Item ${index}`}
		aria-setsize={item_count}
		aria-posinset={index}
		aria-controls={`carousel-item-${index}`}
	>
	</button>
{/snippet}

{#snippet marker_gallery(index: number)}
	{@const carousel_items = get_carousel_items()}
	{@const itemElement = carousel_items[index - 1]}
	{@const img = itemElement?.querySelector('img')}
	<button
		type="button"
		style:background-image={img?.src ? `url(${img.src})` : undefined}
		title={`Item ${index}: ${img?.alt || ''}`}
		class="carousel-control marker gallery"
		aria-selected={index === current_index}
		aria-label={img?.alt || `Item ${index}`}
		aria-controls={`carousel-item-${index}`}
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
			background-color: var(--surface-4);
			border: var(--border-size-1) solid transparent;
			&:where([aria-selected='true']) {
				background: var(--text-2);
			}

			&:where([aria-selected='false']) {
				transform: scale(0.75);
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
