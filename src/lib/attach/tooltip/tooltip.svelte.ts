import { browser } from '$app/environment';
import { mount, unmount } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import Tooltip from './AttachedTooltip.svelte';

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

/** Stable `<dashed-ident>` for `anchor-name` / `position-anchor` (UUID hyphens removed). */
export function invoker_anchor_name(id: string): string {
	return `--invoker-${id.replace(/-/g, '')}`;
}

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
		const { id, anchor_name } = setup_node(target);
		const props = $state({
			...new BaseTooltipProps({}),
			...parameters,
			id,
			invoker: target,
			invoker_anchor_name: anchor_name
		});

		const on_pointer_enter = () => {
			void pointerEnter(props);
		};
		const on_pointer_leave = () => {
			void pointerLeave(props);
		};

		add_event_listeners(node, on_pointer_enter, on_pointer_leave);
		if (!parameters.disabled && !tooltip) {
			tooltip = mount(Tooltip, {
				props,
				target: browser ? document.body : target
			});
		}

		// Clean up
		return () => {
			if (node && props) {
				remove_event_listeners(node, on_pointer_enter, on_pointer_leave);
			}
			if (tooltip) {
				unmount(tooltip);
			}
		};
	};
}

function setup_node(node: HTMLElement): { id: string; anchor_name: string | null } {
	const id = node.id === '' ? crypto.randomUUID() : node.id;
	node.setAttribute('id', id);
	const name = invoker_anchor_name(id);
	if (node !== document.body) {
		node.style.setProperty('anchor-name', name);
	}
	return { id, anchor_name: node !== document.body ? name : null };
}

type TooltipReactiveProps = BaseTooltipProps & {
	id: string;
	invoker: HTMLElement;
	invoker_anchor_name: string | null;
};

async function pointerEnter(props: TooltipReactiveProps) {
	if (props.disabled) return;
	props.visible = true;
}

async function pointerLeave(props: TooltipReactiveProps) {
	props.visible = false;
}

function add_event_listeners(
	node: HTMLElement,
	on_pointer_enter: () => void,
	on_pointer_leave: () => void
) {
	if (browser) {
		node.addEventListener('pointerenter', on_pointer_enter);
		node.addEventListener('pointerleave', on_pointer_leave);
	}
}

function remove_event_listeners(
	node: HTMLElement,
	on_pointer_enter: () => void,
	on_pointer_leave: () => void
) {
	node.removeEventListener('pointerenter', on_pointer_enter);
	node.removeEventListener('pointerleave', on_pointer_leave);
}
