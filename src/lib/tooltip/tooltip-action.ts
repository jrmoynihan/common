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
	keep_visible?: boolean;
	allow_dynamic_position?: boolean;
	delay?: number;
	duration?: number;
	css?: [string, string][];
	custom_component?: unknown;
	x?: number;
	y?: number;
}
const default_parameters: TooltipParameters = {
	position: 'top',
	delay: 0,
	duration: 400,
	keep_visible: false,
	visible: false,
	custom_component: null,
	allow_dynamic_position: true,
	css: []
};

export const tooltip = (
	element: HTMLElement,
	parameters: TooltipParameters = default_parameters
) => {
	let tooltip_parameters = writable<TooltipParameters>({ ...default_parameters, ...parameters });
	let title_attribute: string | null;
	let tooltipComponent: Tooltip;

	// Find offsets if none were provided
	tooltip_parameters.update((current_parameters) => {
		let current_position = current_parameters.position ?? 'top';
		if (current_parameters.horizontal_offset === undefined) {
			current_parameters.horizontal_offset = getHorizontalOffset(current_position);
		}
		if (current_parameters.vertical_offset === undefined) {
			current_parameters.vertical_offset = getVerticalOffset(current_position);
		}
		return current_parameters;
	});
	console.table(get(tooltip_parameters));

	// TODO: add automatic tooltip positioning option: find the closest edge of the element from where the mouse event occurs

	// Add event listeners to the parent element
	element.addEventListener('mouseenter', mouseEnter);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	// Make the tooltip instance.
	tooltipComponent = new Tooltip({
		props: {
			...get(tooltip_parameters),
			keep_visible: false // NOTE: avoids showing the tooltip upon initialization even if you want it kept open upon mouseEnter
		},
		intro: true,
		target: document.body
	});

	function mouseEnter(event: MouseEvent) {
		// If not left-clicking while entering the element's box (i.e. dragging)...
		if (event.buttons !== 1) {
			// Remember the existing title attribute and set the title store to it can react to changes
			storeTitle();

			positionTooltip(
				element,
				tooltipComponent,
				get(tooltip_parameters).position ?? 'top',
				get(tooltip_parameters).allow_dynamic_position,
				get(tooltip_parameters).horizontal_offset,
				get(tooltip_parameters).vertical_offset
			);
			tooltipComponent.$set({ ...get(tooltip_parameters), visible: true });
		}
	}
	function storeTitle() {
		// Store any existing title attribute for use/re-use
		title_attribute = element.getAttribute('title');

		// Set the store to keep track of changing values for the tooltip's title
		if (get(tooltip_parameters).title === undefined) {
			tooltip_parameters.update((current_params) => {
				return { ...current_params, title: title_attribute ?? '' };
			});
		}

		// Remove the `title` attribute, to prevent showing the default browser tooltip; set it back on `mouseleave`
		element.removeAttribute('title');
	}

	async function mouseMove(event: MouseEvent) {
		if (tooltipComponent) {
			positionTooltip(
				element,
				tooltipComponent,
				get(tooltip_parameters).position ?? 'top',
				get(tooltip_parameters).allow_dynamic_position,
				get(tooltip_parameters).horizontal_offset,
				get(tooltip_parameters).vertical_offset
			);
		}
	}

	async function mouseLeave(event: MouseEvent) {
		// If the left-button isn't being pressed...
		if (event.buttons !== 1 && tooltipComponent && element) {
			await new Promise((r) => setTimeout(r, get(tooltip_parameters).delay));
			tooltipComponent.$set({ visible: false });
			// Restore the `title` attribute
			if (title_attribute) element.setAttribute('title', title_attribute);
		}
	}

	return {
		update(new_parameters: TooltipParameters) {
			if (tooltipComponent && new_parameters) {
				console.log(
					get(tooltip_parameters).horizontal_offset,
					get(tooltip_parameters).vertical_offset
				);

				// Temporarily store the old parameter values
				let old_parameters = get(tooltip_parameters);

				if (new_parameters.position) {
					let { position: old_position } = old_parameters;
					let { position: new_position } = new_parameters;

					// If the position swapped sides, invert the horizontal or vertical offsets, respectively
					// if (
					// 	(old_position === 'left' && new_position === 'right') ||
					// 	(old_position === 'right' && new_position === 'left')
					// ) {
					// 	tooltip_parameters.update((current_parameters) => {
					// 		return {
					// 			...current_parameters,
					// 			horizontal_offset: invertOffset(current_parameters.horizontal_offset)
					// 		};
					// 	});
					// }
					// if (
					// 	(old_position === 'top' && new_position === 'bottom') ||
					// 	(old_position === 'bottom' && new_position === 'top')
					// ) {
					// 	tooltip_parameters.update((current_parameters) => {
					// 		return {
					// 			...current_parameters,
					// 			vertical_offset: invertOffset(current_parameters.vertical_offset)
					// 		};
					// 	});
					// }

					tooltip_parameters.update((current_parameters) => {
						return {
							...current_parameters,
							vertical_offset: getVerticalOffset(new_position),
							horizontal_offset: getHorizontalOffset(new_position)
						};
					});

					positionTooltip(
						element,
						tooltipComponent,
						new_position,
						get(tooltip_parameters).allow_dynamic_position,
						get(tooltip_parameters).horizontal_offset,
						get(tooltip_parameters).vertical_offset
					);
				}

				// Update the parameters
				tooltip_parameters.update((current_parameters) => {
					return { ...current_parameters, ...new_parameters };
				});
				console.log(
					get(tooltip_parameters).horizontal_offset,
					get(tooltip_parameters).vertical_offset
				);

				tooltipComponent.$set({ ...new_parameters, keep_visible: false });
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
function getHorizontalOffset(position: string) {
	if (position === 'right') {
		return 10;
	} else if (position === 'left') {
		return -10;
	} else {
		return 0;
	}
}

function getVerticalOffset(position: string) {
	if (position === 'bottom') {
		return 10;
	} else if (position === 'top') {
		return -10;
	} else {
		return 0;
	}
}

function positionX(
	position: string,
	left: number,
	tip_width: number,
	right: number,
	horizontal_middle: number,
	horizontal_offset?: number,
	reposition_onscreen?: boolean
): number {
	let x = 0;
	let margin = 16; // The margin between the tooltip and the edge of the screen
	let screen_width = window.innerWidth;
	if (position === 'left') {
		x = left - tip_width + (horizontal_offset ?? 0);
	} else if (position === 'right') {
		x = right + tip_width + (horizontal_offset ?? 0);
	} else if (position === 'top') {
		x = left + horizontal_middle - tip_width / 2 + (horizontal_offset ?? 0);
	} else if (position === 'bottom') {
		x = left + horizontal_middle - tip_width / 2 + (horizontal_offset ?? 0);
	}
	if (reposition_onscreen) {
		if (x < 0) x = 0 + margin;
		if (x + tip_width > screen_width) x = screen_width - tip_width - margin;
	}
	return x;
}

function positionY(
	position: string,
	top: number,
	tip_height: number,
	bottom: number,
	vertical_middle: number,
	vertical_offset?: number,
	reposition_onscreen?: boolean
): number {
	let y = 0;
	let margin = 16; // The margin between the tooltip and the edge of the screen
	let screen_height = window.innerHeight;
	if (position === 'left') {
		y = top + vertical_middle - tip_height / 2 + (vertical_offset ?? 0);
	} else if (position === 'right') {
		y = top + vertical_middle - tip_height / 2 + (vertical_offset ?? 0);
	} else if (position === 'top') {
		y = top - tip_height + (vertical_offset ?? 0);
	} else if (position === 'bottom') {
		y = bottom + (vertical_offset ?? 0);
	}
	if (reposition_onscreen) {
		if (y < 0) y = 0 + margin;
		if (y + tip_height > screen_height) y = screen_height - tip_height - margin;
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
	x = positionX(position, left, tip_offset_width, right, horizontal_middle, horizontal_offset);
	y = positionY(position, top, tip_offset_height, bottom, vertical_middle, vertical_offset);

	// ** Adjust the tooltip if it would be positioned outside the viewport **
	// Outside left-edge:
	if (x < 0) {
		if (allow_dynamic_position) {
			if (position === 'left') position = 'right'; // Try flipping to opposing edge if there's room
			horizontal_offset = invertOffset(horizontal_offset);
			x = positionX(
				position,
				left,
				tip_offset_width,
				right,
				horizontal_middle,
				horizontal_offset,
				true
			);
		} else {
			x = left;
		}
	}
	// Outside right-edge:
	else if (x + tip_width > window.innerWidth) {
		if (allow_dynamic_position) {
			if (position === 'right') position = 'left';
			horizontal_offset = invertOffset(horizontal_offset);
			x = positionX(
				position,
				left,
				tip_offset_width,
				right,
				horizontal_middle,
				horizontal_offset,
				true
			);
		} else {
			x = window.innerWidth - tip_width;
		}
	}
	// Outside top-edge:
	if (y < 0) {
		if (allow_dynamic_position) {
			if (position === 'top') position = 'bottom';
			vertical_offset = invertOffset(vertical_offset);
			y = positionY(
				position,
				top,
				tip_offset_height,
				bottom,
				vertical_middle,
				vertical_offset,
				true
			);
		} else {
			y = y * -1;
		}
	}
	// Outside bottom-edge:
	else if (y + tip_height > window.innerHeight) {
		if (allow_dynamic_position) {
			if (position === 'bottom') position = 'top';
			vertical_offset = invertOffset(vertical_offset);
			y = positionY(
				position,
				top,
				tip_offset_height,
				bottom,
				vertical_middle,
				vertical_offset,
				true
			);
		} else {
			y = window.innerHeight - tip_height;
		}
	}
	// Update the component state
	tooltipComponent.$set({ x, y, position });
}
