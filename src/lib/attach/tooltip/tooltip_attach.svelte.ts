// tooltip.ts
import type { Attachment } from 'svelte/attachments';
import { mount, type Snippet } from 'svelte';
import { browser } from '$app/env';
import ActionTooltip from './AttachedTooltip.svelte';

type TooltipAttachBase = {
	[key: string]: unknown;
};

/**
 * String or no-arg snippet. `content` is a field-level union so `string | Snippet<[]>`
 * is assignable (object-level unions reject that mix).
 */
export type TooltipAttachmentProps = TooltipAttachBase & {
	content?: string | Snippet<[]>;
};

type TooltipAttachRenderProps<A = unknown> = TooltipAttachBase & {
	content?: string | Snippet<[]> | Snippet<[A]>;
	args?: A;
};

export function tip(element: HTMLElement, props: TooltipAttachmentProps): Attachment<HTMLElement>;
export function tip<A>(
	element: HTMLElement,
	props: TooltipAttachBase & { content: Snippet<[A]>; args: A }
): Attachment<HTMLElement>;
export function tip<A>(
	element: HTMLElement,
	props: TooltipAttachRenderProps<A>
): Attachment<HTMLElement> {
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

	// let tooltip = mount(ActionTooltip, {
	// 	props,
	// 	intro: true,
	// 	target: element
	// });
	return (element: HTMLElement) => {
		add_event_listeners(element);
	};
}
