import { browser } from '$app/environment';
import type { PartiallyRequired } from '$functions/helpers.svelte';
import { ErrorLog } from '$functions/logging.js';
import { mount, unmount, type Snippet } from 'svelte';
import ActionTooltip from './ActionTooltip.svelte';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';
export class BaseTooltipProps<T> {
	/** Choose from top, bottom, right, left anchor positions for the tooltip.
	 * @default top
	 */
	position? = $state<TooltipDirections>('top');
	/** The element id to anchor the tooltip to.
	 * @default a random UUID
	 */
	id? = $state<string>(crypto.randomUUID());
	/** Allow the tooltip to start visible when mounted to the DOM and programmatically trigger its visibility. May be useful for e.g. guided tour interactions.
	 * @default false
	 */
	visible? = $state<boolean>(false);
	/** Prevent the tooltip from being shown.
	 * @default false
	 */
	disabled? = $state<boolean>(false);
	/** Allow the tooltip to stay visible even after the user moves the mouse outside the parent element.
	 * @default false
	 */
	keep_visible? = $state<boolean>(false);
	/** Enable or disable the tooltip arrow
	 * @default true
	 */
	show_arrow? = $state<boolean>(true);
	/** Dynamic styles that can change on the tooltip.  Note: use '--tooltip'-prefixed CSS custom properties wherever possible (e.g. --tooltip-background: 'white' instead of background: 'white').
	 * @default ''
	 */
	styles? = $state<string>('');
	/** The tooltip's distance from the anchor element. Numbers will be converted to `px`. Strings will be passed as CSS property values.
	 * @default 10
	 */
	distance? = $state<number | string>(10);
	/** If the tooltip should be inert or interactive.
	 * @default true
	 */
	inert? = $state<boolean>(true);
	/** The current step of the tooltip when used in a multi-step action
	 * @default 0
	 */
	step? = $state<number>(0);
	/** The additional to move the tooltip to if used in a multi-step action */
	steps? = $state<TooltipStep<T>[]>([]);
	/** Should the tooltip have a fallback position?
	 * @default true
	 */
	fallback? = $state<boolean>(true);
	constructor({ ...args }: Partial<BaseTooltipProps<T>>) {
		this.position = args.position ?? 'top';
		this.id = args.id ?? crypto.randomUUID();
		this.visible = args.visible ?? false;
		this.disabled = args.disabled ?? false;
		this.keep_visible = args.keep_visible ?? false;
		this.show_arrow = args.show_arrow ?? true;
		this.styles = args.styles ?? '';
		this.distance = args.distance ?? 10;
		this.inert = args.inert ?? true;
		this.step = args.step ?? 0;
		this.steps = args.steps ?? [];
		this.fallback = args.fallback ?? true;
	}
}
export class TooltipProps<T> extends BaseTooltipProps<T> {
	/** The content of the tooltip. */
	content?: string;
	constructor({ ...args }: PartiallyRequired<TooltipProps<T>, 'content'>) {
		super(args);
		this.content = args.content;
	}
}

export class TooltipWithContentProps<T> extends BaseTooltipProps<T> {
	/** The content of the tooltip, as a {@link Snippet} */
	content_snippet?: Snippet<[T]>;
	/** Arguments to pass to the content when it is a {@link Snippet} */
	content_args?: T;
	constructor({
		...args
	}: PartiallyRequired<TooltipWithContentProps<T>, 'content_snippet' | 'content_args'>) {
		super(args);
		this.content_snippet = args.content_snippet;
		this.content_args = args.content_args;
	}
}

/** Each additional step takes the same parameters as the action itself, but you must also provide a node to move the tooltips to at each step. */
export type TooltipStep<T> = {
	node: HTMLElement;
} & Omit<TooltipProps<T> | TooltipWithContentProps<T>, 'steps'>;

export function tooltip<C, T extends Partial<TooltipProps<T>> | TooltipWithContentProps<C>>(
	node: HTMLElement,
	// TODO: Fix this.  Could (should) split into two functions, one for TooltipProps and one for TooltipWithContentProps?  Can still reuse the shared logic.
	parameters: TooltipProps<C> | TooltipWithContentProps<C>
) {
	try {
		// Either use existing id to anchor the tooltip, or create a new one and add it to the node
		const id = node.id === '' ? crypto.randomUUID() : node.id;

		// Mark the node with an id so it can be targeted
		node.setAttribute('id', id);
		// Mark the node with a popovertarget so it can be targeted
		node.setAttribute('popovertarget', `tooltip-${id}`);

		const default_props = new BaseTooltipProps<C>({});

		let props = $state<TooltipProps<T> | TooltipWithContentProps<T>>(default_props);
		// Get some nice type-safety for the props
		if ('content' in parameters && parameters.content && typeof parameters.content === 'string') {
			props = { ...default_props, ...parameters, id } as TooltipProps<T>;
		} else if (
			'content_snippet' in parameters &&
			parameters.content_snippet &&
			typeof parameters.content_snippet === 'function'
		) {
			props = { ...default_props, ...parameters, id } as TooltipWithContentProps<C>;
		} else {
			props = { ...default_props, ...parameters, id };
		}

		let tooltip: ReturnType<typeof mount>;

		// Make the tooltip instance if it is enabled.
		if (!props.disabled) {
			// Determine if the tooltip will be within a <dialog> element
			const closest_dialog = node.closest('dialog');
			// const closest_dialog = null;
			const within_dialog = closest_dialog !== null;

			// TODO: Fix this type issue
			tooltip = mount(ActionTooltip, {
				// @ts-ignore
				props,
				intro: true,
				// target: within_dialog ? closest_dialog : node // If tooltip is within dialog, mount it to the dialog, otherwise mount it to the body
				target: node
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
			async update(new_props: TooltipProps<T> | TooltipWithContentProps<T>) {
				//TODO: Fix this with better typing
				for (const [key, value] of Object.entries(new_props)) {
					//@ts-ignore
					props[key] = value;
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
