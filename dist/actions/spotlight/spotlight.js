import { waitForAnimations } from '../general.js';
import { browser } from '$app/environment';
import { getMax } from '../../functions/helpers.js';
import { get, writable } from 'svelte/store';
import ActionSpotlight from './ActionSpotlight.svelte';
export function spotlight(node, parameters) {
    const param_store = writable(parameters);
    // If the steps parameter is provided, use that to determine the nodes to spotlight
    const nodes = parameters?.steps?.map((step) => step.node);
    const spotlight = new ActionSpotlight({
        target: document.body,
        props: { ...parameters, nodes }
    });
    let is_intersecting_viewport = false;
    let ticking = false;
    async function resize(node) {
        await initializeSpotlightPosition(node);
    }
    // Create a resize observer for the parent element if it's box size changes
    const resize_observer = new ResizeObserver(async (entries) => {
        await resize(node);
    });
    // Create an intersection observer to detect when the element is in the viewport
    const intersection_observer = new IntersectionObserver(async (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                is_intersecting_viewport = true;
            }
            else {
                is_intersecting_viewport = false;
            }
        }
    });
    // Create a scroll listener to detect when the element is in the viewport
    async function scroll() { }
    async function addEventListeners(node) {
        if (browser && node) {
            intersection_observer.observe(node);
            resize_observer.observe(node);
            window.addEventListener('resize', () => resize(node));
            node.addEventListener('resize', () => resize(node));
            document.addEventListener('scroll', scroll);
        }
    }
    async function removeEventListeners(node) {
        if (browser && node) {
            intersection_observer.unobserve(node);
            resize_observer.unobserve(node);
            window.removeEventListener('resize', () => resize(node));
            node.removeEventListener('resize', () => resize(node));
            document.removeEventListener('scroll', scroll);
        }
    }
    addEventListeners(node);
    async function getBoundingRectProps(node) {
        const bounds = node.getBoundingClientRect();
        const { width, height, top, left } = bounds;
        return { width, height, top, left };
    }
    async function initializeSpotlightPosition(node, props = get(param_store)) {
        await waitForAnimations(ticking);
        const bounds_props = await getBoundingRectProps(node);
        const initialize_props = { ...bounds_props, ...props };
        // Set the spotlight's position and size
        spotlight.$set({ ...initialize_props });
    }
    // NOTE: need to call get(spotlight_parameters) here to ensure accurate loading of the delay params, likely due to hoisting behaviour
    const { visible, delay } = get(param_store);
    const delays = [];
    if (delay)
        delays.push(delay);
    const max_delay = getMax([...delays, 0]);
    // If the spotlight is made visibile immediately upon mounting, allow a delay before triggering that visibility.
    if (visible && is_intersecting_viewport) {
        makeVisibleAfterDelay(max_delay, node);
    }
    async function makeVisibleAfterDelay(max_delay, node) {
        setTimeout(async () => {
            await initializeSpotlightPosition(node);
        }, max_delay);
    }
    async function goToNextNode(next_index) {
        const props = get(param_store);
        const { steps } = props;
        if (steps && steps.length > 0) {
            // Update the node index
            next_index++;
            await reassignNode(steps[next_index - 1].node);
            // Update the spotlight parameters
            setTimeout(async () => {
                await updater({ ...steps[next_index - 1], node_index: next_index });
                await initializeSpotlightPosition(node, get(param_store));
                await spotlight.reposition();
            }, delay);
        }
    }
    async function reassignNode(new_node) {
        // Remove the event listeners from the current node
        await removeEventListeners(node);
        // Set the node to the next node in the steps array
        node = new_node;
        // Add the event listeners to the new node
        await addEventListeners(node);
    }
    async function updater(new_parameters) {
        if (new_parameters) {
            // Update the parameters store, overriting any existing values with new parameters
            param_store.update((current_parameters) => {
                return { ...current_parameters, ...new_parameters };
            });
            const bounds_props = await getBoundingRectProps(node);
            const new_props = { ...bounds_props, ...new_parameters };
            spotlight.$set({ ...new_props });
        }
    }
    // TODO: Add an on 'previous' event to toggle moving back in the node array
    spotlight.$on('next', (e) => goToNextNode(e.detail.node_index));
    spotlight.$on('closeAll', () => spotlight.$destroy);
    return {
        async update(new_parameters) {
            updater(new_parameters);
        },
        async destroy() {
            removeEventListeners(node);
            intersection_observer.disconnect();
            resize_observer.disconnect();
            spotlight.$destroy();
        },
        spotlight
    };
}
