// import type { SvelteComponent, SvelteComponentTyped } from 'svelte';
import Tooltip from './ActionTooltip.svelte';
import { writable, get } from 'svelte/store';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipParameters {
	position?: TooltipDirections;
	title?: string;
	horizontal_offset?: number;
	vertical_offset?: number;
	visible?: boolean;
	allow_dynamic_position?: boolean;
	delay?: number;
	duration?: number;
	custom_component?: unknown;
}
const default_parameters: TooltipParameters = {
	position: 'top',
	vertical_offset: 0,
	horizontal_offset: 0,
	delay: 0,
	duration: 400,
	custom_component: null,
	allow_dynamic_position: true
};

export const tooltip = (
	element: HTMLElement,
	parameters: TooltipParameters = default_parameters
) => {
	let title = writable<string>(parameters?.title);
	let position = writable<TooltipDirections>(parameters?.position ?? 'top');
	let visible = writable(parameters?.visible ?? true);
	let title_attribute: string | null;
	let tooltipComponent: Tooltip;
	let x: number = 0;
	let y: number = 0;
	let {
		vertical_offset,
		horizontal_offset,
		delay = 0,
		duration = 400,
		custom_component = null,
		allow_dynamic_position = true
	}: TooltipParameters = parameters;

	let original_position = get(position);

	// TODO: add automatic tooltip positioning option: find the closest edge of the element from where the mouse event occurs

	// Set defaults for offsets if they were not provided to the action
	horizontal_offset = getHorizontalOffset(original_position, horizontal_offset);
	vertical_offset = getVerticalOffset(original_position, vertical_offset);

	// Add event listeners to the parent element
	element.addEventListener('mouseenter', mouseEnter);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	// Make the tooltip instance. It will exist in memory prior to being positioned and made visible in the DOM
	tooltipComponent = new Tooltip({
		props: {
			title: get(title),
			position: original_position,
			x,
			y,
			duration,
			delay,
			custom_component
		},
		intro: true,
		target: document.body
	});

	function mouseEnter(event: MouseEvent) {
		// If not left-clicking while entering the element's box (i.e. dragging)...
		if (event.buttons !== 1) {
			// Remember the existing title attribute and set the title store to it can react to changes
			storeTitle();

			// Set store state for tooltip visibility
			if (get(visible) === false) visible.set(parameters?.visible ?? false);

			positionTooltip(
				element,
				tooltipComponent,
				get(position),
				allow_dynamic_position,
				horizontal_offset,
				vertical_offset
			);
			tooltipComponent.$set({ visible: get(visible) });
		}
	}
	function storeTitle() {
		// Store any existing title attribute for use/re-use
		title_attribute = element.getAttribute('title');

		// Set the store to keep track of changing values for the tooltip's title
		if (title_attribute) title.set(title_attribute);
		else if (parameters?.title) title.set(parameters?.title);

		// Remove the `title` attribute, to prevent showing the default browser tooltip; set it back on `mouseleave`
		element.removeAttribute('title');
	}

	async function mouseMove(event: MouseEvent) {
		if (tooltipComponent) {
			positionTooltip(
				element,
				tooltipComponent,
				get(position),
				allow_dynamic_position,
				horizontal_offset,
				vertical_offset
			);
		}
	}

	async function mouseLeave(event: MouseEvent) {
		// If the left-button isn't being pressed...
		if (event.buttons !== 1 && tooltipComponent && element) {
			await new Promise((r) => setTimeout(r, delay));
			tooltipComponent.$set({ visible: false });
			// Restore the `title` attribute
			if (title_attribute) element.setAttribute('title', title_attribute);
		}
	}

	return {
		update(new_parameters: TooltipParameters) {
			if (tooltipComponent && new_parameters) {
				if (new_parameters.title) title.set(new_parameters?.title);
				if (new_parameters.visible) visible.set(new_parameters?.visible);
				if (new_parameters.position) {
					let old_position = get(position);
					let pos = new_parameters.position;
					position.set(pos);
					// If the position swapped sides, invert the offsets
					if (
						(old_position === 'left' && pos === 'right') ||
						(old_position === 'right' && pos === 'left')
					) {
						horizontal_offset = invertOffset(horizontal_offset);
					}
					if (
						(old_position === 'top' && pos === 'bottom') ||
						(old_position === 'bottom' && pos === 'top')
					) {
						vertical_offset = invertOffset(vertical_offset);
					}

					// If the position rotated, unset the horizontal offset
					if (
						((old_position === 'top' || old_position === 'bottom') &&
							(pos === 'left' || pos === 'right')) ||
						((old_position === 'left' || old_position === 'right') &&
							(pos === 'top' || pos === 'bottom'))
					) {
						horizontal_offset = undefined;
						vertical_offset = undefined;
					}

					horizontal_offset = getHorizontalOffset(pos, horizontal_offset);
					vertical_offset = getVerticalOffset(pos, vertical_offset);
					positionTooltip(
						element,
						tooltipComponent,
						pos,
						allow_dynamic_position,
						horizontal_offset,
						vertical_offset
					);
				}
				tooltipComponent.$set({
					title: get(title)
				});
			}
		},
		destroy() {
			element.removeEventListener('mouseover', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	};
};

function invertOffset(offset: number | undefined) {
	if (offset !== undefined) {
		return -1 * offset;
	}
	return 0;
}
function getHorizontalOffset(position: string, horizontal_offset?: number) {
	if (position === 'right') {
		return horizontal_offset ?? 10;
	} else if (position === 'left') {
		return horizontal_offset ?? -10;
	} else {
		return 0;
	}
}

function getVerticalOffset(position: string, vertical_offset?: number) {
	if (position === 'bottom') {
		return vertical_offset ?? 10;
	} else if (position === 'top') {
		return vertical_offset ?? -10;
	} else {
		return 0;
	}
}

function positionX(
	position: string,
	left: number,
	tip_width: number,
	width: number,
	horizontal_middle: number,
	horizontal_offset?: number
): number {
	let x = 0;
	if (position === 'left') {
		x = left - tip_width + (horizontal_offset ?? 0);
	} else if (position === 'right') {
		x = left + width + (horizontal_offset ?? 0);
	} else if (position === 'top') {
		x = left + horizontal_middle - tip_width / 2 + (horizontal_offset ?? 0);
	} else if (position === 'bottom') {
		x = left + horizontal_middle - tip_width / 2 + (horizontal_offset ?? 0);
	}
	return x;
}

function positionY(
	position: string,
	top: number,
	tip_height: number,
	bottom: number,
	vertical_middle: number,
	vertical_offset?: number
): number {
	let y = 0;
	if (position === 'left') {
		y = top + vertical_middle - tip_height / 2 + (vertical_offset ?? 0);
	} else if (position === 'right') {
		y = top + vertical_middle - tip_height / 2 + (vertical_offset ?? 0);
	} else if (position === 'top') {
		y = top - tip_height + (vertical_offset ?? 0);
	} else if (position === 'bottom') {
		y = bottom + (vertical_offset ?? 0);
	}
	return y;
}
function positionTooltip(
	element: {
		getBoundingClientRect: () => {
			top: any;
			bottom: any;
			left: any;
			right: any;
			height: any;
			width: any;
		};
	},
	tooltipComponent: {
		$set?: any;
		clientWidth?: any;
		offsetWidth?: any;
		clientHeight?: any;
		offsetHeight?: any;
	},
	position: string,
	allow_dynamic_position: any,
	horizontal_offset?: number,
	vertical_offset?: number
) {
	let x: number;
	let y: number;

	// Find the bounds of the parent element of the tooltip
	const { top, bottom, left, right, height, width } = element.getBoundingClientRect();
	const vertical_middle = height / 2;
	const horizontal_middle = width / 2;

	// Measure the rendered tooltip's dimensions
	const {
		clientWidth: tip_width,
		offsetWidth: tip_offset_width,
		clientHeight: tip_height,
		offsetHeight: tip_offset_height
	} = tooltipComponent;

	// Change the position of the tooltip to the middle of the parent element's box, on the edge indicated by the 'position' parameter
	x = positionX(position, left, tip_offset_width, width, horizontal_middle, horizontal_offset);
	y = positionY(position, top, tip_offset_height, bottom, vertical_middle, vertical_offset);

	// Adjust the tooltip if it would be positioned outside the viewport
	// Outside left-edge:
	if (x < 0) {
		if (allow_dynamic_position) {
			position = 'right';
			horizontal_offset = invertOffset(horizontal_offset);
			x = positionX(position, left, tip_offset_width, width, horizontal_middle, horizontal_offset);
		} else {
			x = left;
		}
	}
	// Outside right-edge:
	else if (x + tip_width > window.innerWidth) {
		if (allow_dynamic_position) {
			position = 'left';
			horizontal_offset = invertOffset(horizontal_offset);
			x = positionX(position, left, tip_offset_width, width, horizontal_middle, horizontal_offset);
		} else {
			x = window.innerWidth - tip_width;
		}
	}
	// Outside top-edge:
	if (y < 0) {
		if (allow_dynamic_position) {
			position = 'bottom';
			vertical_offset = invertOffset(vertical_offset);
			y = positionY(position, top, tip_offset_height, bottom, vertical_middle, vertical_offset);
		} else {
			y = y * -1;
		}
	}
	// Outside bottom-edge:
	else if (y + tip_height > window.innerHeight) {
		if (allow_dynamic_position) {
			position = 'top';
			vertical_offset = invertOffset(vertical_offset);
			y = positionY(position, top, tip_offset_height, bottom, vertical_middle, vertical_offset);
		} else {
			y = window.innerHeight - tip_height;
		}
	}
	// Update the component state
	tooltipComponent.$set({ x, y, position });
}
