import { browser } from '$app/environment';
import {
	getAncestors,
	delay as delayFor,
	getMax,
	getTransitionDurations
} from '$lib/functions/helpers';
import Tooltip from '$lib/tooltip/ActionTooltip.svelte';
import { writable, get } from 'svelte/store';
import type {
	EasingFunction,
	FadeParams,
	FlyParams,
	ScaleParams,
	SlideParams,
	TransitionConfig
} from 'svelte/transition';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';

// An optional "public" interface for the user to pass into the tooltip action from elements
export interface TooltipParameters {
	/** Choose from top, bottom, right, left anchor positions for the tooltip. */
	position?: TooltipDirections;
	/** The text content of the tooltip.  Will be set as the title attribute after the tooltip is hidden. */
	title?: string;
	/** How far (in px) to horizontally offset the tooltip */
	horizontal_offset?: number;
	/** How far (in px) to vertically offset the tooltip */
	vertical_offset?: number;
	/** Allow the tooltip to start visible when mounted to the DOM and programmatically trigger its visibility. May be useful for e.g. guided tour interactions. */
	visible?: boolean;
	/** Allow the tooltip to stay visible even after the user moves the mouse outside the parent element. */
	keep_visible?: boolean;
	/** Enable or disable the tooltip arrow */
	show_arrow?: boolean;
	/** Allows the tooltip to reposition itself to fit on-screen */
	allow_dynamic_position?: boolean;
	/** Delay the entrnace and exit transition of the tooltip symmetrically.  An explicit transition config's delay property will override this! */
	delay?: number;
	/** Delay just on the appearance of the tooltip.  Overrides the more general 'delay' property, but an explicit transition config's delay property will override this! */
	in_delay?: number;
	/** Delay just on the exit of the tooltip.  Overrides the more general 'delay' property, an explicit transition config's delay property will override this! */
	out_delay?: number;
	/** Delays the calculation of the tooltip's position upon mounting.  Tooltips inherently wait for parent transitions/animations to finish before calculating their positions (since it may change by the end of the transition).  If you want the tooltip to be visible "immediately", it is recommended to add a positioning delay here to  */
	visibility_delay?: number;
	/** Duration of the in/out transition of the tooltip.  An explicit transition config will override this! */
	duration?: number;
	/** Easing function of the in/out transition of the tooltip.  An explicit transition config will override this! */
	easing?: EasingFunction;
	/** Dynamic CSS properties/values that can change on the tooltip. */
	css?: [string, string][];
	/** A component to show inside the tooltip */
	custom_component?: unknown;
	/** Disabling the tooltip prevents it from appearing on mouseover events. */
	disabled?: boolean;
	/** A Svelte transition to use on the tooltip */
	transition?: any;
	/** An explicit transition config. Will override delay, duration, easing props on the tooltip action. */
	transition_config?: FlyParams | FadeParams | ScaleParams | SlideParams | TransitionConfig;
	/** For development-only.  Console log certain events/function calls. */
	log_functions?: boolean;
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
	in_delay: 0,
	out_delay: 0,
	visibility_delay: 0,
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
	marginTop: 0,
	disabled: false,
	log_functions: false
};

export const tooltip = (
	element: HTMLElement,
	parameters: TooltipParameters = default_parameters
) => {
	const animations = document.body.getAnimations({ subtree: true });
	const ancestor_nodes = getAncestors(element) as HTMLElement[];
	// console.log('ancestor nodes of', element.textContent, ancestor_nodes);

	// Find max transition/animation time on ancestor nodes
	const ancestor_transition_durations = getTransitionDurations(ancestor_nodes);
	const max_ancestor_transition_duration = getMax(ancestor_transition_durations) * 1000;
	// console.log('max duration transition of ancestors:', max_ancestor_transition_duration);

	const dialog = ancestor_nodes?.find((ele) => ele?.tagName === 'DIALOG') as HTMLDialogElement;
	// if (dialog) 	console.log('found a dialog ancestor!');

	let tooltip_parameters = writable<TooltipActionParameters>({
		...default_parameters,
		...parameters
	});
	let { log_functions } = get(tooltip_parameters);
	let title_attribute: string | null;
	let tooltipComponent: Tooltip;

	// Find offsets if none were provided
	tooltip_parameters.update((current_parameters) => {
		if (current_parameters.horizontal_offset === undefined) {
			current_parameters.horizontal_offset = getHorizontalOffset(current_parameters.position);
		}
		if (current_parameters.vertical_offset === undefined) {
			current_parameters.vertical_offset = getVerticalOffset(current_parameters.position);
		}
		return current_parameters;
	});

	// Add event listeners to the parent element
	element.addEventListener('mouseenter', mouseEnter);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	// Prune away the unneeded params before passing/setting the tooltip parameters (avoids warning msg in console)
	const new_tooltip_parameters = getParametersForNewTooltip();
	const { visible, in_delay, out_delay, visibility_delay, ...all_other_new_tooltip_parameters } =
		new_tooltip_parameters;
	const { delay } = new_tooltip_parameters;

	// Make the tooltip instance.
	tooltipComponent = new Tooltip({
		//@ts-ignore
		props: {
			...all_other_new_tooltip_parameters
		},
		intro: true,
		target: dialog?.firstElementChild ? dialog.firstElementChild : document.body
	});
	// TODO: See if Pop-Up API (top-layer promotion) is available yet https://chromestatus.com/feature/5463833265045504

	// Create a resize observer for the parent element
	const resize_observer = new ResizeObserver(async (entries) => {
		for (const entry of entries) {
			if (entry.borderBoxSize) {
				initializeTooltipPosition();
			}
		}
	});

	async function waitForAnimations() {
		await delayFor(max_ancestor_transition_duration);
		// Make sure all animations have settled (resolved or rejected); Rejection can happen when the element unmounts before the animation finishes
		if (animations?.length > 0) {
			const finishes = animations.map((a) => a.finished);
			const finished = await Promise.allSettled(finishes);
		}
	}

	// NOTE: need to call get(tooltip_parameters) here to ensure accurate loading of the delay params, likely due to hoisting behaviour
	const {
		visibility_delay: v_delay,
		delay: total_delay,
		in_delay: i_delay
	} = get(tooltip_parameters);
	const delays = [];
	if (v_delay) delays.push(v_delay);
	if (total_delay) delays.push(total_delay);
	if (i_delay) delays.push(i_delay);
	const max_delay = getMax([...delays, 0]);

	function makeVisibleAfterDelay() {
		setTimeout(() => {
			tooltipComponent.$set({ visible: true });
		}, max_delay);
	}

	// If the tooltip is made visibile immediately upon mounting, allow a delay before triggering that visibility.
	if (visible) {
		makeVisibleAfterDelay();
	}

	// Add a resize observer to the window that triggers repositioning/resizing of the tooltip, and a scroll event listener to the document
	if (browser) {
		window.addEventListener('resize', resize);
		document.addEventListener('scroll', scroll);
		resize_observer.observe(element);
	}

	async function resize() {
		initializeTooltipPosition();
	}

	let ticking = false;
	async function scroll() {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				initializeTooltipPosition({ allow_offscreen: true });
				ticking = false;
			});
			ticking = true;
		}
	}

	function mouseEnter(event?: MouseEvent) {
		// If not left-clicking while entering the element's box (i.e. dragging)...
		if (event?.buttons !== 1 && get(tooltip_parameters).disabled !== true) {
			// Remember the existing title attribute and set the title store to it can react to changes
			storeTitle();

			setTimeout(() => {
				tooltipComponent.$set({ visible: true });
			}, get(tooltip_parameters).in_delay);
		}
	}
	function getParametersForNewTooltip(): TooltipActionParameters {
		const {
			horizontal_offset,
			vertical_offset,
			allow_dynamic_position,
			disabled,
			log_functions,
			out_delay,
			in_delay,
			visibility_delay: positioning_delay,
			...passing_parameters
		} = get(tooltip_parameters);
		return passing_parameters;
	}
	function makeInvisibleTooltip(parameters: TooltipActionParameters) {
		return new Tooltip({
			//@ts-ignore
			props: { ...parameters, visible: true, only_for_measuring: true },
			target: document.body
		});
	}
	async function initializeTooltipPosition({
		allow_offscreen = false,
		wait_for_animations = true
	}: { allow_offscreen?: boolean; wait_for_animations?: boolean } = {}) {
		// Prune away the unneeded params before passing/setting the tooltip parameters (avoids warning msg in console)
		const new_tooltip_parameters = getParametersForNewTooltip();
		const { horizontal_offset, vertical_offset } = get(tooltip_parameters);
		const { visible, ...parameters_without_visible } = new_tooltip_parameters;

		if (wait_for_animations) {
			await waitForAnimations();
		}

		// Create a non-interactive copy of the tooltip that appears instantly so we can measure the full width of the new tooltip before positioning it
		const invisible_tooltip = makeInvisibleTooltip(new_tooltip_parameters);

		// Position the invisible tooltip
		await positionTooltip(
			element,
			invisible_tooltip,
			new_tooltip_parameters.position ?? 'top',
			new_tooltip_parameters.allow_dynamic_position,
			horizontal_offset,
			vertical_offset,
			allow_offscreen
		);

		// Move the real one to the same position
		tooltipComponent.$set({
			...parameters_without_visible,
			x: invisible_tooltip.x,
			y: invisible_tooltip.y,
			position: invisible_tooltip.position
		});

		// Remove the invisible tooltip
		invisible_tooltip.$destroy();
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
		// Don't reposition if there's no tooltip or it's being kept open/visible
		// if (tooltipComponent && !(tooltipComponent.visible && tooltipComponent.keep_visible)) {
		// 	positionTooltip(
		// 		element,
		// 		tooltipComponent,
		// 		get(tooltip_parameters).position ?? 'top',
		// 		get(tooltip_parameters).allow_dynamic_position,
		// 		get(tooltip_parameters).horizontal_offset ?? 0,
		// 		get(tooltip_parameters).vertical_offset ?? 0
		// 	);
		// }
		// if (tooltipComponent && get(tooltip_parameters).visible) initializeTooltipPosition();
	}

	async function mouseLeave(event: MouseEvent) {
		// If the left-button isn't being pressed...
		if (event.buttons !== 1 && tooltipComponent && element) {
			const { delay, out_delay } = get(tooltip_parameters);
			await new Promise((r) => setTimeout(r, out_delay ?? delay));
			tooltipComponent.$set({ visible: false });
			// Restore the `title` attribute
			if (title_attribute) element.setAttribute('title', title_attribute);
		}
	}

	/** Updates the store values for the horizontal and vertical offset parameters when the position changes */
	function changeOffsets(old_parameters: TooltipParameters, new_parameters: TooltipParameters) {
		let old_position = old_parameters?.position ?? 'top';
		let new_position = new_parameters?.position ?? 'top';

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
					vertical_offset: getVerticalOffset(new_position, current_parameters.vertical_offset, true)
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
					horizontal_offset: new_parameters.horizontal_offset ?? getHorizontalOffset(new_position),
					vertical_offset: new_parameters.vertical_offset ?? getVerticalOffset(new_position)
				};
			});
		}
	}
	async function positionTooltip(
		affixed_element: HTMLElement,
		tooltipComponent: Tooltip,
		new_position: TooltipDirections,
		allow_dynamic_position: boolean | undefined,
		horizontal_offset?: number,
		vertical_offset?: number,
		allow_offscreen: boolean = false
	) {
		let x: number;
		let y: number;

		// Find the bounds of the affixed elemetn and the padding of the parent of the affixed element for the tooltip (for absolute positioning within dialogs)
		const { top, bottom, left, right, height, width } = affixed_element.getBoundingClientRect();
		const parent_styles: CSSStyleDeclaration | null = affixed_element?.parentElement
			? window.getComputedStyle(affixed_element?.parentElement)
			: null;

		const vertical_middle = height / 2;
		const horizontal_middle = width / 2;

		// Measure the rendered tooltip's dimensions
		let {
			clientWidth: tip_width,
			offsetWidth: tip_offset_width,
			clientHeight: tip_height,
			offsetHeight: tip_offset_height,
			marginLeft: tip_margin_left,
			marginTop: tip_margin_top,
			marginRight: tip_margin_right,
			marginBottom: tip_margin_bottom,
			position: current_position
		} = tooltipComponent;

		const x_params = {
			position: new_position,
			left,
			width,
			horizontal_middle,
			horizontal_offset,
			tip_offset_width,
			tip_margin_left
		};
		const y_params = {
			position: new_position,
			top,
			bottom,
			vertical_middle,
			vertical_offset,
			tip_offset_height,
			tip_margin_top
		};

		// Change the position of the tooltip to the middle of the parent element's box, on the edge indicated by the 'position' parameter
		x =
			dialog && parent_styles
				? positionXAbsolute({ ...x_params, tip_margin_right, parent_styles })
				: positionX(x_params);
		y =
			dialog && parent_styles
				? positionYAbsolute({ ...y_params, parent_styles })
				: positionY(y_params);

		// ** Adjust the tooltip if it would be positioned outside the viewport **
		// Outside left-edge:
		if (!dialog) {
			if (x < 0) {
				if (allow_dynamic_position) {
					horizontal_offset = getHorizontalOffset(new_position, horizontal_offset, true);
					x = repositionX({
						position: new_position,
						left,
						width,
						horizontal_middle,
						horizontal_offset,
						tip_offset_width,
						tip_margin_left
					});
				} else if (!allow_offscreen) {
					x = left;
				}
			}
			// Outside right-edge:
			else if (x + tip_width > window.innerWidth) {
				if (allow_dynamic_position) {
					horizontal_offset = getHorizontalOffset(new_position, horizontal_offset, true);
					x = repositionX({
						position: new_position,
						left,
						width,
						horizontal_middle,
						horizontal_offset,
						tip_offset_width,
						tip_margin_left
					});
				} else if (!allow_offscreen) {
					x = window.innerWidth - tip_width;
				}
			}
			// Outside top-edge:
			if (y < 0) {
				if (allow_dynamic_position) {
					vertical_offset = getVerticalOffset(new_position, vertical_offset, true);
					y = repositionY({
						position: new_position,
						top,
						bottom,
						vertical_middle,
						vertical_offset,
						tip_offset_height,
						tip_margin_top
					});
				} else if (!allow_offscreen) {
					y = y * -1;
				}
			}
			// Outside bottom-edge:
			else if (y + tip_height > window.innerHeight) {
				if (allow_dynamic_position) {
					vertical_offset = getVerticalOffset(new_position, vertical_offset, true);
					y = repositionY({
						position: new_position,
						top,
						bottom,
						vertical_middle,
						vertical_offset,
						tip_offset_height,
						tip_margin_top
					});
				} else if (!allow_offscreen) {
					y = window.innerHeight - tip_height;
				}
			}
		}
		// Update the component state
		tooltipComponent.$set({ x, y, position: new_position });
	}

	return {
		update(new_parameters: TooltipParameters) {
			if (tooltipComponent && new_parameters) {
				// Temporarily store the old parameter values
				let old_parameters = get(tooltip_parameters);

				// Update the parameters store, overriting any existing values with new parameters
				tooltip_parameters.update((current_parameters) => {
					return { ...current_parameters, ...new_parameters };
				});

				if (new_parameters.position) {
					changeOffsets(old_parameters, new_parameters);
					initializeTooltipPosition({ wait_for_animations: false });
				}

				tooltipComponent.$set({ ...new_parameters });
			}
		},
		destroy() {
			tooltipComponent.$destroy();
			element.removeEventListener('mouseover', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
			window.removeEventListener('resize', resize);
			resize_observer.disconnect();
		}
	};
};

function getHorizontalOffset(
	position: TooltipDirections,
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

function getVerticalOffset(
	position: TooltipDirections,
	designated_offset?: number,
	should_invert?: boolean
) {
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
function getParentPaddings(parent_styles: CSSStyleDeclaration) {
	const { paddingLeft, paddingRight, paddingTop, paddingBottom } = parent_styles;
	const parent_padding_left: number = parseInt(paddingLeft.replace('px', ''));
	const parent_padding_right: number = parseInt(paddingRight.replace('px', ''));
	const parent_padding_top: number = parseInt(paddingTop.replace('px', ''));
	const parent_padding_bottom: number = parseInt(paddingBottom.replace('px', ''));
	return { parent_padding_top, parent_padding_right, parent_padding_bottom, parent_padding_left };
}
interface positionX_params {
	position: string;
	left: number;
	width: number;
	horizontal_middle: number;
	tip_offset_width: number;
	tip_margin_left: number;
	horizontal_offset?: number;
}
interface positionXAbsolute_params extends positionX_params {
	tip_margin_right: number;
	parent_styles: CSSStyleDeclaration;
}

function positionX(input: positionX_params): number {
	const {
		position,
		left,
		width,
		horizontal_middle,
		tip_offset_width,
		tip_margin_left,
		horizontal_offset = 0
	} = input;
	if (position === 'left') {
		return left - tip_offset_width - tip_margin_left + horizontal_offset;
	} else if (position === 'right') {
		return left + width - tip_margin_left + horizontal_offset;
	} else if (position === 'top' || position === 'bottom') {
		return left + horizontal_middle - tip_margin_left - tip_offset_width / 2 + horizontal_offset;
	} else {
		return 0;
	}
}
function positionXAbsolute(input: positionXAbsolute_params): number {
	const {
		position,
		left,
		width,
		horizontal_middle,
		tip_offset_width,
		tip_margin_left,
		tip_margin_right,
		horizontal_offset = 0,
		parent_styles
	} = input;
	const { parent_padding_left, parent_padding_right, parent_padding_top, parent_padding_bottom } =
		getParentPaddings(parent_styles);

	if (position === 'top' || position === 'bottom') {
		return (
			horizontal_middle +
			parent_padding_left +
			tip_margin_left -
			tip_offset_width / 2 +
			horizontal_offset
		);
	} else if (position === 'left') {
		return -tip_offset_width - tip_margin_left + parent_padding_left + horizontal_offset;
	} else if (position === 'right') {
		return (
			tip_offset_width +
			tip_margin_right +
			parent_padding_left +
			parent_padding_right +
			horizontal_offset
		);
	} else {
		return 0;
	}
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
	tip_offset_height: number;
	tip_margin_top: number;
	vertical_offset?: number;
}
interface positionYAbsolute_params extends positionY_params {
	parent_styles: CSSStyleDeclaration;
}
function positionY(input: positionY_params): number {
	const {
		position,
		top,
		bottom,
		vertical_middle,
		tip_offset_height,
		tip_margin_top,
		vertical_offset = 0
	} = input;
	if (position === 'left' || position === 'right') {
		return top + vertical_middle - tip_margin_top - tip_offset_height / 2 + vertical_offset;
	} else if (position === 'top') {
		return top - tip_offset_height - tip_margin_top + vertical_offset;
	} else if (position === 'bottom') {
		return bottom - tip_margin_top + vertical_offset;
	} else {
		return 0;
	}
}
function positionYAbsolute(input: positionYAbsolute_params) {
	const {
		position,
		top,
		bottom,
		vertical_middle,
		tip_offset_height,
		tip_margin_top,
		vertical_offset = 0,
		parent_styles
	} = input;
	const { parent_padding_left, parent_padding_right, parent_padding_top, parent_padding_bottom } =
		getParentPaddings(parent_styles);

	if (position === 'left' || position === 'right') {
		return vertical_middle - tip_margin_top - tip_offset_height / 2 + vertical_offset;
	} else if (position === 'top') {
		return -tip_offset_height + parent_padding_top + vertical_offset;
	} else if (position === 'bottom') {
		return tip_margin_top + vertical_offset;
	} else {
		return 0;
	}
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
