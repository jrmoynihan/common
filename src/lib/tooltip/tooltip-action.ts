import Tooltip from './ActionTooltip.svelte';
import { writable, get } from 'svelte/store';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';

// An optional "public" interface for the user to pass into the tooltip action from elements
export interface TooltipParameters {
	position?: TooltipDirections;
	title?: string;
	horizontal_offset?: number;
	vertical_offset?: number;
	visible?: boolean;
	keep_visible?: boolean;
	show_arrow?: boolean;
	allow_dynamic_position?: boolean;
	delay?: number;
	duration?: number;
	css?: [string, string][];
	custom_component?: unknown;
	x?: number;
	y?: number;
}

// A non-optional default/private interface to ensure type-safety and all variables are set
interface TooltipActionParameters extends TooltipParameters {
	position: TooltipDirections;
	x: number;
	y: number;
	offsetWidth: number;
	offsetHeight: number;
	clientWidth: number;
	clientHeight: number;
	marginLeft: number;
	marginTop: number;
}
const default_parameters: TooltipActionParameters = {
	position: 'top',
	delay: 0,
	duration: 400,
	keep_visible: false,
	visible: false,
	custom_component: null,
	allow_dynamic_position: true,
	css: [],
	x: 0,
	y: 0,
	offsetWidth: 0,
	offsetHeight: 0,
	clientWidth: 0,
	clientHeight: 0,
	marginLeft: 0,
	marginTop: 0
};

export const tooltip = (
	element: HTMLElement,
	parameters: TooltipParameters = default_parameters
) => {
	let tooltip_parameters = writable<TooltipActionParameters>({
		...default_parameters,
		...parameters
	});
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

	// Add event listeners to the parent element
	element.addEventListener('mouseenter', mouseEnter);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	// Prune away the unneeded params before passing/setting the tooltip parameters (avoids warning msg in console)
	const { horizontal_offset, vertical_offset, allow_dynamic_position, ...passing_parameters } =
		get(tooltip_parameters);

	// Make the tooltip instance.
	tooltipComponent = new Tooltip({
		props: {
			...passing_parameters,
			keep_visible: false // NOTE: avoids showing the tooltip upon initialization even if you want it kept open upon mouseEnter
		},
		intro: true,
		target: document.body
	});

	function mouseEnter(event?: MouseEvent) {
		// If not left-clicking while entering the element's box (i.e. dragging)...
		if (event?.buttons !== 1) {
			// Remember the existing title attribute and set the title store to it can react to changes
			storeTitle();

			// Prune away the unneeded params before passing/setting the tooltip parameters (avoids warning msg in console)
			const { horizontal_offset, vertical_offset, allow_dynamic_position, ...passing_parameters } =
				get(tooltip_parameters);

			// Create a non-interactive copy of the tooltip that appears instantly so we can measure the full width of the new tooltip before positioning it
			const invisible_tooltip = new Tooltip({
				props: { ...passing_parameters, visible: true, only_for_measuring: true },
				target: document.body
			});
			// Position the invisible tooltip
			positionTooltip(
				element,
				invisible_tooltip,
				get(tooltip_parameters).position ?? 'top',
				get(tooltip_parameters).allow_dynamic_position,
				get(tooltip_parameters).horizontal_offset ?? 0,
				get(tooltip_parameters).vertical_offset ?? 0
			);

			// Move the real one to the same positionm and make it visible, triggering its transition
			tooltipComponent.$set({
				...passing_parameters,
				x: invisible_tooltip.x,
				y: invisible_tooltip.y,
				position: invisible_tooltip.position,
				visible: true
			});

			// Remove the invisible tooltip
			invisible_tooltip.$destroy();
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

	function mouseMove(event: MouseEvent) {
		// if (tooltipComponent && !(tooltipComponent.visible && tooltipComponent.keep_visible)) {
		// 	positionTooltip(
		// 		element,
		// 		tooltipComponent,
		// 		get(tooltip_parameters).position ?? 'top',
		// 		get(tooltip_parameters).allow_dynamic_position,
		// 		get(tooltip_parameters).horizontal_offset,
		// 		get(tooltip_parameters).vertical_offset
		// 	);
		// }
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
				// Temporarily store the old parameter values
				let old_parameters = get(tooltip_parameters);

				if (new_parameters.position) {
					let { position: old_position } = old_parameters;
					let { position: new_position } = new_parameters;

					// If the position swapped sides, invert the horizontal or vertical offsets, respectively
					if (
						(old_position === 'left' && new_position === 'right') ||
						(old_position === 'right' && new_position === 'left')
					) {
						tooltip_parameters.update((current_parameters) => {
							return {
								...current_parameters,
								horizontal_offset: getHorizontalOffset(
									new_position,
									current_parameters.horizontal_offset,
									true
								)
							};
						});
					} else if (
						(old_position === 'top' && new_position === 'bottom') ||
						(old_position === 'bottom' && new_position === 'top')
					) {
						tooltip_parameters.update((current_parameters) => {
							return {
								...current_parameters,
								vertical_offset: getVerticalOffset(
									new_position,
									current_parameters.vertical_offset,
									true
								)
							};
						});
					} else if (new_position === old_position) {
						tooltip_parameters.update((current_parameters) => {
							return {
								...current_parameters,
								horizontal_offset: getHorizontalOffset(
									new_position,
									current_parameters.horizontal_offset
								),
								vertical_offset: getVerticalOffset(new_position, current_parameters.vertical_offset)
							};
						});
					} else {
						tooltip_parameters.update((current_parameters) => {
							return {
								...current_parameters,
								horizontal_offset:
									new_parameters.horizontal_offset ?? getHorizontalOffset(new_position),
								vertical_offset: new_parameters.vertical_offset ?? getVerticalOffset(new_position)
							};
						});
					}

					positionTooltip(
						element,
						tooltipComponent,
						new_position,
						get(tooltip_parameters).allow_dynamic_position,
						get(tooltip_parameters).horizontal_offset ?? 0,
						get(tooltip_parameters).vertical_offset ?? 0
					);
				}

				// Update the parameters
				tooltip_parameters.update((current_parameters) => {
					return { ...current_parameters, ...new_parameters };
				});

				tooltipComponent.$set({ ...new_parameters, keep_visible: false });
			}
		},
		destroy() {
			tooltipComponent.$destroy();
			element.removeEventListener('mouseover', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	};
};

function getHorizontalOffset(
	position: string,
	designated_offset?: number,
	should_invert?: boolean
) {
	if (designated_offset !== undefined) {
		return should_invert ? -1 * designated_offset : designated_offset;
	}
	if (position === 'right') {
		return 10;
	} else if (position === 'left') {
		return -10;
	} else {
		return 0;
	}
}

function getVerticalOffset(position: string, designated_offset?: number, should_invert?: boolean) {
	if (designated_offset !== undefined) {
		return should_invert ? -1 * designated_offset : designated_offset;
	}
	if (position === 'bottom') {
		return 10;
	} else if (position === 'top') {
		return -10;
	} else {
		return 0;
	}
}
interface positionX_params {
	position: string;
	left: number;
	width: number;
	horizontal_middle: number;
	horizontal_offset: number;
	tip_offset_width: number;
	tip_margin_left: number;
}
function positionX(input: positionX_params): number {
	let x = 0;
	const {
		position,
		left,
		width,
		horizontal_middle,
		horizontal_offset,
		tip_offset_width,
		tip_margin_left
	} = input;
	if (position === 'left') {
		x = left - tip_offset_width - tip_margin_left + (horizontal_offset ?? 0);
	} else if (position === 'right') {
		x = left + width - tip_margin_left + (horizontal_offset ?? 0);
	} else if (position === 'top') {
		x =
			left + horizontal_middle - tip_margin_left - tip_offset_width / 2 + (horizontal_offset ?? 0);
	} else if (position === 'bottom') {
		x =
			left + horizontal_middle - tip_margin_left - tip_offset_width / 2 + (horizontal_offset ?? 0);
	}
	return x;
}
function repositionX(input: positionX_params) {
	let x = positionX(input);
	const { tip_offset_width } = input;
	const min_margin = 16; // The minimum margin (in px) between the tooltip and the edge of the screen
	const screen_width = window.innerWidth;
	if (x < 0) x = 0 + min_margin;
	if (x + tip_offset_width > screen_width) x = screen_width - tip_offset_width - min_margin;
	return x;
}

interface positionY_params {
	position: string;
	top: number;
	bottom: number;
	vertical_middle: number;
	vertical_offset: number;
	tip_offset_height: number;
	tip_margin_top: number;
}
function positionY(input: positionY_params): number {
	let y = 0;
	const {
		position,
		top,
		bottom,
		vertical_middle,
		vertical_offset,
		tip_offset_height,
		tip_margin_top
	} = input;
	if (position === 'left') {
		y = top + vertical_middle - tip_margin_top - tip_offset_height / 2 + (vertical_offset ?? 0);
	} else if (position === 'right') {
		y = top + vertical_middle - tip_margin_top - tip_offset_height / 2 + (vertical_offset ?? 0);
	} else if (position === 'top') {
		y = top - tip_offset_height - tip_margin_top + (vertical_offset ?? 0);
	} else if (position === 'bottom') {
		y = bottom - tip_margin_top + (vertical_offset ?? 0);
	}
	return y;
}
function repositionY(input: positionY_params) {
	let y = positionY(input);
	const { tip_offset_height } = input;
	const min_margin = 16; // The minimum margin (in px) between the tooltip and the edge of the screen
	const screen_height = window.innerHeight;
	if (y < 0) y = 0 + min_margin;
	if (y + tip_offset_height > screen_height) y = screen_height - tip_offset_height - min_margin;
	return y;
}
function positionTooltip(
	element: HTMLElement,
	tooltipComponent: Tooltip,
	position: TooltipDirections,
	allow_dynamic_position: boolean | undefined,
	horizontal_offset: number,
	vertical_offset: number
) {
	let x: number;
	let y: number;

	// Find the bounds of the parent element of the tooltip
	const { top, bottom, left, right, height, width } = element.getBoundingClientRect();
	const vertical_middle = height / 2;
	const horizontal_middle = width / 2;

	// Measure the rendered tooltip's dimensions
	let {
		clientWidth: tip_width,
		offsetWidth: tip_offset_width,
		clientHeight: tip_height,
		offsetHeight: tip_offset_height,
		marginLeft: tip_margin_left,
		marginTop: tip_margin_top
	} = tooltipComponent;

	// Change the position of the tooltip to the middle of the parent element's box, on the edge indicated by the 'position' parameter
	x = positionX({
		position,
		left,
		width,
		horizontal_middle,
		horizontal_offset,
		tip_offset_width,
		tip_margin_left
	});
	y = positionY({
		position,
		top,
		bottom,
		vertical_middle,
		vertical_offset,
		tip_offset_height,
		tip_margin_top
	});

	// ** Adjust the tooltip if it would be positioned outside the viewport **
	// Outside left-edge:
	if (x < 0) {
		if (allow_dynamic_position) {
			if (position === 'left') position = 'right'; // Try flipping to opposing edge if there's room
			horizontal_offset = getHorizontalOffset(position, horizontal_offset, true);
			x = repositionX({
				position,
				left,
				width,
				horizontal_middle,
				horizontal_offset,
				tip_offset_width,
				tip_margin_left
			});
		} else {
			x = left;
		}
	}
	// Outside right-edge:
	else if (x + tip_width > window.innerWidth) {
		if (allow_dynamic_position) {
			if (position === 'right') position = 'left';
			horizontal_offset = getHorizontalOffset(position, horizontal_offset, true);
			x = repositionX({
				position,
				left,
				width,
				horizontal_middle,
				horizontal_offset,
				tip_offset_width,
				tip_margin_left
			});
		} else {
			x = window.innerWidth - tip_width;
		}
	}
	// Outside top-edge:
	if (y < 0) {
		if (allow_dynamic_position) {
			if (position === 'top') position = 'bottom';
			vertical_offset = getVerticalOffset(position, vertical_offset, true);
			y = repositionY({
				position,
				top,
				bottom,
				vertical_middle,
				vertical_offset,
				tip_offset_height,
				tip_margin_top
			});
		} else {
			y = y * -1;
		}
	}
	// Outside bottom-edge:
	else if (y + tip_height > window.innerHeight) {
		if (allow_dynamic_position) {
			if (position === 'bottom') position = 'top';
			vertical_offset = getVerticalOffset(position, vertical_offset, true);
			y = repositionY({
				position,
				top,
				bottom,
				vertical_middle,
				vertical_offset,
				tip_offset_height,
				tip_margin_top
			});
		} else {
			y = window.innerHeight - tip_height;
		}
	}
	// Update the component state
	tooltipComponent.$set({ x, y, position });
}
