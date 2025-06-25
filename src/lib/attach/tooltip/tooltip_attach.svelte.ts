// tooltip.ts
import type { Attachment } from 'svelte/attachments';
import { mount, type Snippet } from 'svelte';
import { browser } from '$app/environment';
import ActionTooltip from './AttachedTooltip.svelte';

type TooltipStringContent = {
	content: string;
	[key: string]: any;
};

type TooltipSnippetNoArgs = {
	content: Snippet<[]>;
	[key: string]: any;
};

type TooltipSnippetWithArgs<T extends any[]> = {
	content: Snippet<T>;
	[key: string]: T[number];
};

export type TooltipAttachmentProps<T> =
	| TooltipStringContent
	| TooltipSnippetNoArgs
	| TooltipSnippetWithArgs<[T]>;

export function tip<T>(
	element: HTMLElement,
	props: TooltipAttachmentProps<T>
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
