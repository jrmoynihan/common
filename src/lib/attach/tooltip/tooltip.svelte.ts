import { browser } from '$app/environment';
import { mount, unmount } from 'svelte';
import Tooltip from './AttachedTooltip.svelte';
import type { Attachment } from 'svelte/attachments';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';
const void_elements = [
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
];
class BaseTooltipProps {
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
	style? = $state<string>('');
	/** The tooltip's distance from the anchor element. Numbers will be converted to `px`. Strings will be passed as CSS property values.
	 * @default 10
	 */
	distance? = $state<number | string>(10);
	/** If the tooltip should be inert or interactive.
	 * @default true
	 */
	inert? = $state<boolean>(true);
	/** Should the tooltip have a fallback position?
	 * @default true
	 */
	fallback? = $state<boolean>(true);
	constructor({ ...args }: Partial<BaseTooltipProps>) {
		this.position = args.position ?? 'top';
		this.id = args.id ?? crypto.randomUUID();
		this.visible = args.visible ?? false;
		this.disabled = args.disabled ?? false;
		this.keep_visible = args.keep_visible ?? false;
		this.show_arrow = args.show_arrow ?? true;
		this.style = args.style ?? '';
		this.distance = args.distance ?? 10;
		this.inert = args.inert ?? true;
		this.fallback = args.fallback ?? true;
	}
}

type TooltipString = {
	content?: string;
	[key: string]: any;
};
type TooltipSnippetNoArgs = {
	content: () => any;
	[key: string]: any;
};
type TooltipSnippetWithArgs<Args> = {
	content: (...args: [Args]) => any;
	args: Args;
	[key: string]: any;
};

export type TooltipProps = TooltipString | TooltipSnippetNoArgs | TooltipSnippetWithArgs<any>;

export function tooltip(parameters: TooltipString): Attachment<HTMLElement>;
export function tooltip(parameters: TooltipSnippetNoArgs): Attachment<HTMLElement>;
export function tooltip<
	S extends (...args: any) => any,
	Args extends Parameters<S>[0] = Parameters<S>[0]
>(parameters: { content: S; args: Args }): Attachment<HTMLElement>;
export function tooltip(parameters: TooltipProps): Attachment<HTMLElement> {
	let tooltip: ReturnType<typeof mount>;
	return (node: HTMLElement) => {
		const target = void_elements.includes(node.nodeName.toLowerCase())
			? (node.closest('label') ?? document.body)
			: node;
		const id = setup_node(target);
		const props = $state({ ...new BaseTooltipProps({}), ...parameters, id });
		add_event_listeners(node, props);
		if (!parameters.disabled && !tooltip) {
			tooltip = mount(Tooltip, {
				props,
				target
			});
		}

		// Clean up
		return () => {
			remove_event_listeners(node, props);
			unmount(tooltip);
		};
	};
}

function setup_node(node: HTMLElement): string {
	// Either use existing id to anchor the tooltip, or create a new one and add it to the node
	const id = node.id === '' ? crypto.randomUUID() : node.id;
	// Mark the node with an id so it can be targeted
	node.setAttribute('id', id);
	// TODO: See if Popover API (top-layer promotion) is available yet https://chromestatus.com/feature/5463833265045504
	// Mark the node with a popovertarget so it can be targeted
	node.setAttribute('popovertarget', `tooltip-${id}`);
	return id;
}

/** Store the element's title attribute for re-use */
async function storeTitle() {}

async function pointerEnter(props: BaseTooltipProps) {
	if (props.disabled) return;
	props.visible = true;
}

async function pointerLeave(props: BaseTooltipProps) {
	props.visible = false;
}
/** Add event listeners and observers to the parent node */
async function add_event_listeners(node: HTMLElement, props: BaseTooltipProps) {
	if (browser) {
		node.addEventListener('pointerenter', pointerEnter.bind(null, props));
		node.addEventListener('pointerleave', pointerLeave.bind(null, props));
	}
}

async function remove_event_listeners(node: HTMLElement, props: BaseTooltipProps) {
	node.removeEventListener('pointerenter', pointerEnter.bind(null, props));
	node.removeEventListener('pointerleave', pointerLeave.bind(null, props));
}

async function reassignNode(new_node: HTMLElement, props: BaseTooltipProps) {
	// Remove the event listeners from the current node
	await remove_event_listeners(new_node, props);
	// Add the event listeners to the new node
	await add_event_listeners(new_node, props);
}
