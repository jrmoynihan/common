import { waitForAnimations } from '$actions/general.js';
import { browser } from '$app/environment';
import { getMax } from '$functions/helpers.js';
import type { ComponentProps } from 'svelte';
import { get, writable } from 'svelte/store';
import ActionSpotlight from './ActionSpotlight.svelte';

// Options to make:
// Toggleable
// Dismissable
// Rounded-spotlight
// Horizontal/Vertical Elliptical-spotlight
// Cut-out spotlight
// Follows the cursor

export function spotlight(node: HTMLElement, parameters?: ComponentProps<ActionSpotlight>) {
	const param_store = writable(parameters);
	const spotlight: ActionSpotlight = new ActionSpotlight({
		intro: true,
		target: document.body,
		props: { ...parameters }
	});
	let is_intersecting_viewport = false;
	let ticking = false;

	async function resize() {
		await initializeSpotlightPosition();
	}

	// Create a resize observer for the parent element if it's box size changes
	const resize_observer = new ResizeObserver(async (entries) => {
		await resize();
	});

	// Create an intersection observer to detect when the element is in the viewport
	const intersection_observer = new IntersectionObserver(async (entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				is_intersecting_viewport = true;
			} else {
				is_intersecting_viewport = false;
			}
		}
	});

	// Create a scroll listener to detect when the element is in the viewport
	async function scroll() {}

	async function addEventListeners() {
		if (browser) {
			intersection_observer.observe(node);
			resize_observer.observe(node);
			window.addEventListener('resize', resize);
			node.addEventListener('resize', resize);
			document.addEventListener('scroll', scroll);
		}
	}

	addEventListeners();

	async function getBoundingRectProps() {
		const bounds = node.getBoundingClientRect();
		const { width, height, top, left } = bounds;
		const width_px = `${width}px`;
		const height_px = `${height}px`;
		const top_px = `${top}px`;
		const left_px = `${left}px`;
		return { width, height, top, left, width_px, height_px, top_px, left_px };
	}

	async function initializeSpotlightPosition(
		parameters: ComponentProps<ActionSpotlight> = get(param_store)
	) {
		await waitForAnimations(ticking);
		const bounds_props = await getBoundingRectProps();
		const props = { ...bounds_props, ...parameters };
		console.log('initialized props', props);

		// Set the spotlight's position and size
		spotlight.$set({ ...props });
	}

	// NOTE: need to call get(tooltip_parameters) here to ensure accurate loading of the delay params, likely due to hoisting behaviour
	const {
		visibility_delay: v_delay,
		delay: total_delay,
		in_delay: i_delay,
		visible
	} = get(param_store);
	const delays = [];
	if (v_delay) delays.push(v_delay);
	if (total_delay) delays.push(total_delay);
	if (i_delay) delays.push(i_delay);
	const max_delay = getMax([...delays, 0]);

	// If the tooltip is made visibile immediately upon mounting, allow a delay before triggering that visibility.
	if (visible && is_intersecting_viewport) {
		makeVisibleAfterDelay(max_delay);
	}
	async function makeVisibleAfterDelay(max_delay: number) {
		setTimeout(async () => {
			await initializeSpotlightPosition();
		}, max_delay);
	}

	return {
		async update(new_parameters?: ComponentProps<ActionSpotlight>) {
			if (new_parameters) {
				// Update the parameters store, overriting any existing values with new parameters
				param_store.update((current_parameters) => {
					return { ...current_parameters, ...new_parameters };
				});

				const bounds_props = await getBoundingRectProps();
				const props = { ...bounds_props, ...new_parameters };
				spotlight.$set({ ...props });
			}
		},
		async destroy() {
			window.removeEventListener('resize', resize);
			node.removeEventListener('resize', resize);
			document.removeEventListener('scroll', scroll);
			intersection_observer.disconnect();
			resize_observer.disconnect();
			spotlight.$destroy();
		}
	};
}
