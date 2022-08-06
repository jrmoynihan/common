import Tooltip from './ActionTooltip.svelte';
import type { SvelteComponent } from 'svelte';
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
	custom_component?: SvelteComponent;
}
const default_parameters: TooltipParameters = {
	position: 'top',
	vertical_offset: 0,
	horizontal_offset: 0,
	delay: 0,
	duration: 400,
	custom_component: undefined,
	allow_dynamic_position: true
};

export const tooltip = (
	element: HTMLElement,
	parameters: TooltipParameters = default_parameters
) => {
	let title = writable<string>();
	let visible = writable(parameters?.visible ?? true);
	let title_attribute: string | null;
	let tooltipComponent: Tooltip;
	let x: number;
	let y: number;
	let {
		position = 'top',
		vertical_offset = 0,
		horizontal_offset = 0,
		delay = 0,
		duration = 400,
		custom_component,
		allow_dynamic_position = true
	} = parameters;

	let original_position = position;

	// TODO: add automatic tooltip positioning option: find the closest edge of the element from where the mouse event occurs

	// Set defaults for offsets if they were not provided to the action
	horizontal_offset = setHorizontalOffset(position, horizontal_offset);
	vertical_offset = setVerticalOffset(position, vertical_offset);

	// Add event listeners to the parent element
	element.addEventListener('mouseenter', mouseEnter);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	function mouseEnter(event: MouseEvent) {
		// If not left-clicking while entering the element's box (i.e. dragging)...
		if (event.buttons !== 1) {
			// Remember the existing title attribute and set the title store to it can react to changes
			storeTitle();

			// Set store state for tooltip visibility
			if (get(visible) === false) visible.set(parameters?.visible ?? false);

			// Make the tooltip instance
			tooltipComponent = new Tooltip({
				props: {
					title: get(title),
					position,
					x,
					y,
					duration,
					delay,
					custom_component
				},
				intro: true,
				target: element
			});

			positionTooltip(
				element,
				tooltipComponent,
				position,
				horizontal_offset,
				vertical_offset,
				allow_dynamic_position
			);
			tooltipComponent.$set({ visible: get(visible) });
		}
	}
	function storeTitle() {
		// Store the title attribute for use
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
				original_position,
				horizontal_offset,
				vertical_offset,
				allow_dynamic_position
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
			if (tooltipComponent) {
				if (new_parameters) {
					if (new_parameters.title) title.set(new_parameters?.title);
					if (new_parameters.visible) visible.set(new_parameters?.visible);
				}
				tooltipComponent.$set({ title: get(title) });
			}
		},
		destroy() {
			element.removeEventListener('mouseover', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	};
};

function invertOffset(offset: number) {
	return -1 * offset;
}
function setHorizontalOffset(position: string, horizontal_offset: number) {
	if (position === 'right') {
		return horizontal_offset !== 0 ? horizontal_offset : 10;
	} else if (position === 'left') {
		return horizontal_offset !== 0 ? horizontal_offset : -10;
	} else {
		return 0;
	}
}

function setVerticalOffset(position: string, vertical_offset: number) {
	if (position === 'bottom') {
		return vertical_offset !== 0 ? vertical_offset : 10;
	} else if (position === 'top') {
		return vertical_offset !== 0 ? vertical_offset : -10;
	} else {
		return 0;
	}
}

function positionX(
	position: string,
	left: number,
	tip_width: number,
	horizontal_offset: any,
	width: any,
	horizontal_middle: number
) {
	if (position === 'left') {
		return left - tip_width + (horizontal_offset || 0);
	} else if (position === 'right') {
		return left + width + horizontal_offset || 0;
	} else if (position === 'top') {
		return left + horizontal_middle - tip_width / 2 + (horizontal_offset || 0);
	} else if (position === 'bottom') {
		return left + horizontal_middle - tip_width / 2 + (horizontal_offset || 0);
	}
}

function positionY(
	position: string,
	top: number,
	tip_height: number,
	vertical_offset: any,
	bottom: any,
	vertical_middle: number
) {
	if (position === 'left') {
		return top + vertical_middle - tip_height / 2 + (vertical_offset || 0);
	} else if (position === 'right') {
		return top + vertical_middle - tip_height / 2 + (vertical_offset || 0);
	} else if (position === 'top') {
		return top - tip_height + (vertical_offset || 0);
	} else if (position === 'bottom') {
		return bottom + (vertical_offset || 0);
	}
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
	horizontal_offset: number,
	vertical_offset: number,
	allow_dynamic_position: any
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
	x = positionX(position, left, tip_offset_width, horizontal_offset, width, horizontal_middle);
	y = positionY(position, top, tip_offset_height, vertical_offset, bottom, vertical_middle);

	// Adjust the tooltip if it would be positioned outside the viewport
	// Outside left-edge:
	if (x < 0) {
		if (allow_dynamic_position) {
			position = 'right';
			horizontal_offset = invertOffset(horizontal_offset);
			x = positionX(position, left, tip_offset_width, horizontal_offset, width, horizontal_middle);
		} else {
			x = left;
		}
	}
	// Outside right-edge:
	else if (x + tip_width > window.innerWidth) {
		if (allow_dynamic_position) {
			position = 'left';
			horizontal_offset = invertOffset(horizontal_offset);
			x = positionX(position, left, tip_offset_width, horizontal_offset, width, horizontal_middle);
		} else {
			x = window.innerWidth - tip_width;
		}
	}
	// Outside top-edge:
	if (y < 0) {
		if (allow_dynamic_position) {
			position = 'bottom';
			vertical_offset = invertOffset(vertical_offset);
			y = positionY(position, top, tip_offset_height, vertical_offset, bottom, vertical_middle);
		} else {
			y = y * -1;
		}
	}
	// Outside bottom-edge:
	else if (y + tip_height > window.innerHeight) {
		if (allow_dynamic_position) {
			position = 'top';
			vertical_offset = invertOffset(vertical_offset);
			y = positionY(position, top, tip_offset_height, vertical_offset, bottom, vertical_middle);
		} else {
			y = window.innerHeight - tip_height;
		}
	}
	// Update the component state
	tooltipComponent.$set({ x, y, position });
}
