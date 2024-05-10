import { browser } from '$app/environment';
import { ErrorLog } from '$functions/logging.js';
import { mount, unmount, type Snippet } from 'svelte';
import ActionTooltip from './ActionTooltip.svelte';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipProps extends Record<string, unknown> {
	/** The content of the tooltip, either a `string` or a {@link Snippet} */
	content?: string | Snippet<[any]>;
	/** Choose from top, bottom, right, left anchor positions for the tooltip. */
	position?: TooltipDirections;
	/** The element id to anchor the tooltip to. */
	id?: string;
	/** Allow the tooltip to start visible when mounted to the DOM and programmatically trigger its visibility. May be useful for e.g. guided tour interactions. */
	visible?: boolean;
	/** Prevent the tooltip from being shown. */
	disabled?: boolean;
	/** Allow the tooltip to stay visible even after the user moves the mouse outside the parent element. */
	keep_visible?: boolean;
	/** Enable or disable the tooltip arrow */
	show_arrow?: boolean;
	/** Dynamic styles that can change on the tooltip.  Note: use '--tooltip'-prefixed CSS custom properties wherever possible (e.g. --tooltip-background: 'white' instead of background: 'white'). */
	styles?: string;
	/** The tooltip's distance from the anchor element. Numbers will be converted to `px`. Strings will be passed as CSS property values.
	 * @default 10
	 */
	distance?: number | string;
	/** If the tooltip should be inert or interactive.
	 * @default true
	 */
	inert?: boolean;
	/** The current step of the tooltip when used in a multi-step action */
	step?: number;
	/** The additional to move the tooltip to if used in a multi-step action */
	steps?: TooltipStep[];
	/** Should the tooltip have a fallback position? */
	fallback?: boolean;
}

/** Each additional step takes the same parameters as the action itself, but you must also provide a node to move the tooltips to at each step. */
export type TooltipStep = {
	node: HTMLElement;
} & Omit<TooltipProps, 'steps'>;

const default_parameters: TooltipProps = {
	disabled: false,
	content: '',
	position: 'top',
	visible: false,
	keep_visible: false,
	show_arrow: true,
	styles: '',
	id: crypto.randomUUID(),
	step: 0,
	steps: [],
	fallback: true
};

export function tooltip(node: HTMLElement, parameters: TooltipProps = default_parameters) {
	try {
		// Either use existing id to anchor the tooltip, or create a new one and add it to the node
		const id = node.id === '' ? crypto.randomUUID() : node.id;

		// Mark the node with an id so it can be targeted
		node.setAttribute('id', id);
		// Mark the node with a popovertarget so it can be targeted
		node.setAttribute('popovertarget', `tooltip-${id}`);

		let props: TooltipProps = $state<TooltipProps>({ ...default_parameters, ...parameters, id });

		let tooltip: ReturnType<typeof mount>;

		// Make the tooltip instance if it is enabled.
		if (!props.disabled) {
			// Determine if the tooltip will be within a <dialog> element
			// const closest_dialog = node.closest('dialog')
			const closest_dialog = null;
			const within_dialog = closest_dialog !== null;

			tooltip = mount(ActionTooltip, {
				props: within_dialog ? { ...props, fallback: false } : props, // Don't use fallback position if tooltip is within dialog (it will often intersect the dialog edge, causing the fallback to trigger)
				intro: true,
				target: within_dialog ? closest_dialog : document.body // If tooltip is within dialog, mount it to the dialog, otherwise mount it to the body
			});
		}
		// TODO: See if Popover API (top-layer promotion) is available yet https://chromestatus.com/feature/5463833265045504

		/** Store the title attribute for re-use */
		async function storeTitle() {}

		async function pointerEnter(event: PointerEvent) {
			if (props.disabled) return;
			props.visible = true;
		}

		async function pointerLeave(event: PointerEvent) {
			props.visible = false;
		}

		/** Add event listeners and observers to the parent node */
		async function add_event_listeners(node: HTMLElement) {
			if (browser) {
				node.addEventListener('pointerenter', pointerEnter);
				node.addEventListener('pointerleave', pointerLeave);
			}
		}

		async function reassignNode(new_node: HTMLElement) {
			// Remove the event listeners from the current node
			await remove_event_listeners(node);
			// Add the event listeners to the new node
			await add_event_listeners(new_node);
		}

		async function remove_event_listeners(node: HTMLElement) {
			node.removeEventListener('pointerenter', pointerEnter);
			node.removeEventListener('pointerleave', pointerLeave);
		}

		add_event_listeners(node);

		return {
			async update(new_parameters: TooltipProps) {
				for (const [key, value] of Object.entries(new_parameters)) {
					if (key in props) {
						props[key] = value;
					}
				}
			},
			async destroy() {
				await remove_event_listeners(node);
				if (tooltip) unmount(tooltip);
			}
			// async goToNextNode() {
			// 	const { step, steps } = props;
			// 	if(!step || !steps) return;
			// 	if (step < steps.length - 1) {
			// 		// Update the tooltip parameters after the delay
			// 		const next = steps[step + 1];
			// 		const { node, ...rest } = next;
			// 			await reassignNode(node);
			// 			await updater(rest);
			// 	}
			// }
		};
	} catch (error) {
		if (error instanceof Error) ErrorLog({ error });
	}
}
