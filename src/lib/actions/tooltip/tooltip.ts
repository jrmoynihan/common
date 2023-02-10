import { waitForAnimations } from '$actions/general.js';
import { browser } from '$app/environment';
import { getAncestors, getMax, getTransitionDurations } from '$functions/helpers.js';
import { ErrorLog } from '$functions/logging.js';
import type { ComponentProps } from 'svelte';
import { get, writable } from 'svelte/store';
import ActionTooltip from './ActionTooltip.svelte';

export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';

/** Each additional step takes the same parameters as the action itself, but you must also provide a node to move the tooltips to at each step. */
export type TooltipStep = {
	node: HTMLElement;
} & Omit<TooltipParameters, 'nodes'>;

// An optional "public" interface for the user to pass into the tooltip action from elements
export interface TooltipParameters extends ComponentProps<ActionTooltip> {
	/** How far (in px) to horizontally offset the tooltip */
	horizontal_offset?: number;
	/** How far (in px) to vertically offset the tooltip */
	vertical_offset?: number;
	/** Allows the tooltip to reposition itself to fit on-screen */
	allow_dynamic_position?: boolean;
	/** Delay just on the appearance of the tooltip.  Overrides the more general 'delay' property, but an explicit transition config's delay property will override this! */
	in_delay?: number;
	/** Delay just on the exit of the tooltip.  Overrides the more general 'delay' property, an explicit transition config's delay property will override this! */
	out_delay?: number;
	/** Delays the calculation of the tooltip's position upon mounting.  Tooltips inherently wait for parent transitions/animations to finish before calculating their positions (since it may change by the end of the transition).  If you want the tooltip to be visible "immediately", it is recommended to add a positioning delay here to  */
	visibility_delay?: number;
	/** A component to show inside the tooltip */
	custom_component?: ConstructorOfATypedSvelteComponent;
	/** Disabling the tooltip prevents it from appearing on mouseover events. */
	disabled?: boolean;
	/** The additional nodes to travel to after closing the initial spotlight. */
	steps?: TooltipStep[];
}

const default_parameters: TooltipParameters = {
	in_delay: 0,
	out_delay: 0,
	visibility_delay: 0,
	allow_dynamic_position: true,
	disabled: false
};

export function tooltip(node: HTMLElement, parameters: TooltipParameters = default_parameters) {
	try {
		// Find max transition/animation time on ancestor nodes
		const ancestor_nodes = getAncestors(node) as HTMLElement[];
		const ancestor_transition_durations = getTransitionDurations(ancestor_nodes);
		const max_ancestor_transition_duration = getMax(ancestor_transition_durations) * 1000;

		// Is a dialog one of the anchor element's ancestor's?
		const dialog = ancestor_nodes?.find((ele) => ele?.tagName === 'DIALOG') as HTMLDialogElement;

		// Measure anchor element's position in the DOM to check if it reflows somewhere down the line
		let { top: anchor_top, left: anchor_left } = node.getBoundingClientRect();

		let tooltip_parameters = writable<TooltipParameters>({
			...default_parameters,
			...parameters
		});
		let title_attribute: string | null;
		let tooltip: ActionTooltip;
		let ticking = false;
		let is_intersecting_viewport = false;
		let first_mouse_enter = true;

		// Find offsets if none were provided
		tooltip_parameters.update((current_parameters) => {
			const { horizontal_offset, vertical_offset, position } = current_parameters;
			if (position && horizontal_offset === undefined) {
				current_parameters.horizontal_offset = getHorizontalOffset(position);
			}
			if (position && vertical_offset === undefined) {
				current_parameters.vertical_offset = getVerticalOffset(position);
			}
			return current_parameters;
		});

		// Create an intersection observer for the parent element
		const intersection_observer = new IntersectionObserver(async (entries) => {
			for await (const entry of entries) {
				if (entry.isIntersecting) {
					is_intersecting_viewport = true;
					await initializeTooltipPosition();
				} else {
					is_intersecting_viewport = false;
				}
			}
		});

		// Create a resize observer for the parent element if it's box size changes
		const resize_observer = new ResizeObserver(async (entries) => {
			for await (const entry of entries) {
				if (is_intersecting_viewport && (entry.borderBoxSize || entry.contentRect)) {
					await initializeTooltipPosition();
				}
			}
		});

		// Add a resize event to the window that triggers repositioning/resizing of the tooltip
		async function resize() {
			if (!ticking && is_intersecting_viewport) {
				window.requestAnimationFrame(async () => {
					await initializeTooltipPosition();
					ticking = false;
				});
				ticking = true;
			}
		}

		async function scroll() {
			if (!ticking && is_intersecting_viewport) {
				window.requestAnimationFrame(async () => {
					await initializeTooltipPosition(true);
					ticking = false;
				});
				ticking = true;
			}
		}

		/** Add event listeners and observers to the parent element, window, or document */
		async function addEventListeners(node: HTMLElement) {
			if (browser && node) {
				intersection_observer.observe(node);
				resize_observer.observe(node);
				node.addEventListener('mouseenter', mouseEnter);
				node.addEventListener('mouseleave', mouseLeave);
				node.addEventListener('mousemove', mouseMove);
				window.addEventListener('resize', resize);
				node.addEventListener('resize', resize);
				document.addEventListener('scroll', scroll);
			}
		}

		addEventListeners(node);

		// Prune away the unneeded params before passing/setting the tooltip parameters (avoids warning msg in console)
		let new_tooltip_parameters = getParametersForNewTooltip();

		const { visible, in_delay, out_delay, visibility_delay, ...all_other_new_tooltip_parameters } =
			new_tooltip_parameters;
		const { delay } = new_tooltip_parameters;

		// Make the tooltip instance.
		tooltip = new ActionTooltip({
			//@ts-ignore
			props: {
				...all_other_new_tooltip_parameters
			},
			intro: true,
			target: dialog?.firstElementChild ? dialog.firstElementChild : document.body
		});
		// TODO: See if Pop-Up API (top-layer promotion) is available yet https://chromestatus.com/feature/5463833265045504

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

		async function changeVisiblityAfterDelay({
			visibility,
			delay
		}: {
			visibility: boolean;
			delay: number;
		}) {
			setTimeout(async () => {
				tooltip.$set({ visible: visibility });
			}, delay);
		}

		// If the tooltip is made visibile immediately upon mounting, allow a delay before triggering that visibility.
		if (visible && is_intersecting_viewport) {
			changeVisiblityAfterDelay({ visibility: true, delay: max_delay });
		}

		async function mouseEnter(event?: MouseEvent) {
			// Check if the anchor element has moved since mounting
			const { top, left } = node.getBoundingClientRect();
			if (top !== anchor_top || left !== anchor_left || first_mouse_enter) {
				first_mouse_enter = false;
				anchor_top = top;
				anchor_left = left;
				initializeTooltipPosition();
			}

			const { in_delay, disabled, delay } = get(tooltip_parameters);

			// If not left-clicking while entering the element's box (i.e. dragging)...
			if (event?.buttons !== 1 && disabled !== true) {
				// Remember the existing title attribute and set the title store to it can react to changes
				await storeTitle();

				// Make the tooltip visible after a delay
				await changeVisiblityAfterDelay({ visibility: true, delay: in_delay ?? delay ?? 0 });
			}
		}
		/** Prune away the unneeded params before passing/setting the tooltip parameters (avoids console warning messages for extraneous props) */
		function getParametersForNewTooltip(): TooltipParameters {
			const {
				horizontal_offset,
				vertical_offset,
				allow_dynamic_position,
				disabled,
				out_delay,
				in_delay,
				visibility_delay: positioning_delay,
				...passing_parameters
			} = get(tooltip_parameters);
			return passing_parameters;
		}
		async function makeInvisibleTooltip(parameters: TooltipParameters) {
			// @ts-ignore
			return new ActionTooltip({
				props: { ...parameters, visible: true, only_for_measuring: true },
				target: document.body
			});
		}
		async function initializeTooltipPosition(allow_offscreen = false) {
			const new_tooltip_parameters = getParametersForNewTooltip();
			const { horizontal_offset, vertical_offset } = get(tooltip_parameters);
			// const { visible, ...pruned_parameters } = new_tooltip_parameters;

			await waitForAnimations(ticking);

			// Create a non-interactive copy of the tooltip that appears instantly so we can measure the full width of the new tooltip before positioning it
			const invisible_tooltip = await makeInvisibleTooltip(new_tooltip_parameters);

			// Position the invisible tooltip
			await positionTooltip(
				node,
				invisible_tooltip,
				new_tooltip_parameters.position ?? 'top',
				new_tooltip_parameters.allow_dynamic_position,
				horizontal_offset,
				vertical_offset,
				allow_offscreen
			);

			// Move the real one to the same position
			tooltip.$set({
				x: invisible_tooltip.x,
				y: invisible_tooltip.y,
				position: invisible_tooltip.position
			});

			// Remove the invisible tooltip
			invisible_tooltip.$destroy();
		}
		async function storeTitle() {
			// Store any existing title attribute for use/re-use
			title_attribute = node.getAttribute('title');
			const params = get(tooltip_parameters);

			// Set the store to keep track of changing values for the tooltip's title
			if (params.title === undefined) {
				tooltip_parameters.update((current_params) => {
					return { ...current_params, title: title_attribute ?? '' };
				});
			}

			// Remove the `title` attribute, to prevent showing the default browser tooltip; set it back on `mouseleave`
			node.removeAttribute('title');
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
			// If the left mouse button isn't being pressed...
			if (event.buttons !== 1 && tooltip && node) {
				const { delay, out_delay } = get(tooltip_parameters);

				await changeVisiblityAfterDelay({ visibility: false, delay: out_delay ?? delay ?? 0 });

				// Restore the `title` attribute
				if (title_attribute) node.setAttribute('title', title_attribute);
			}
		}

		/** Updates the store values for the horizontal and vertical offset parameters when the position changes */
		async function changeOffsets(
			old_parameters: TooltipParameters,
			new_parameters: TooltipParameters
		) {
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
		}

		// TODO: Move this into reactive statements inside the component itself?
		async function positionTooltip(
			anchor_element: HTMLElement,
			tooltipComponent: ActionTooltip,
			new_position: TooltipDirections,
			allow_dynamic_position: boolean | undefined,
			horizontal_offset?: number,
			vertical_offset?: number,
			allow_offscreen: boolean = false
		) {
			let x: number;
			let y: number;

			// Find the bounds of the affixed element and the padding of the parent of the affixed element for the tooltip (for absolute positioning within dialogs)
			const { top, bottom, left, right, height, width } = anchor_element.getBoundingClientRect();
			const parent_styles: CSSStyleDeclaration | null = anchor_element?.parentElement
				? window.getComputedStyle(anchor_element?.parentElement)
				: null;

			const vertical_middle = height / 2;
			const horizontal_middle = width / 2;

			// Measure the rendered tooltip's dimensions
			let {
				clientWidth: tip_width = 0,
				offsetWidth: tip_offset_width = 0,
				clientHeight: tip_height = 0,
				offsetHeight: tip_offset_height = 0,
				marginLeft: tip_margin_left = 0,
				marginTop: tip_margin_top = 0,
				marginRight: tip_margin_right,
				paddingLeft: tip_padding_left,
				paddingRight: tip_padding_right
				// paddingTop: tip_padding_top,
				// paddingBottom: tip_padding_bottom,
				// marginBottom: tip_margin_bottom,
				// position: current_position
			} = tooltipComponent;

			const x_params = {
				position: new_position,
				left,
				width,
				horizontal_middle,
				horizontal_offset,
				tip_offset_width,
				tip_margin_left,
				tip_margin_right,
				tip_padding_left,
				tip_padding_right
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
					? await positionXAbsolute({
							...x_params,
							tip_margin_right,
							tip_padding_left,
							parent_styles
					  })
					: await positionX(x_params);
			y =
				dialog && parent_styles
					? await positionYAbsolute({ ...y_params, parent_styles })
					: await positionY(y_params);

			// ** Adjust the tooltip if it would be positioned outside the viewport **
			// Outside left-edge:
			if (!dialog) {
				if (x < 0) {
					if (allow_dynamic_position) {
						horizontal_offset = getHorizontalOffset(new_position, horizontal_offset, true);
						x = await repositionX({
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
						x = await repositionX({
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
						y = await repositionY({
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
						y = await repositionY({
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
		async function updater(new_parameters: TooltipParameters) {
			if (tooltip && new_parameters) {
				// Temporarily store the old parameter values
				const old_parameters = get(tooltip_parameters);

				// Update the parameters store, overriting any existing values with new parameters
				tooltip_parameters.update((current_parameters) => {
					return { ...current_parameters, ...new_parameters };
				});

				if (new_parameters.position) {
					await changeOffsets(old_parameters, new_parameters);
					await initializeTooltipPosition();
				}

				tooltip.$set({ ...new_parameters });
			}
		}
		async function reassignNode(new_node: HTMLElement) {
			// Remove the event listeners from the current node
			await removeEventListeners(node);
			// Set the node to the next node in the steps array
			node = new_node;
			// Add the event listeners to the new node
			await addEventListeners(node);
		}
		async function removeEventListeners(node: HTMLElement) {
			node.removeEventListener('mouseover', mouseEnter);
			node.removeEventListener('mouseleave', mouseLeave);
			node.removeEventListener('mousemove', mouseMove);
			window.removeEventListener('resize', resize);
			document.removeEventListener('scroll', scroll);
			resize_observer.unobserve(node);
		}

		// FIXME: tooltip updates on scroll while not visible!
		return {
			async update(new_parameters: TooltipParameters) {
				updater(new_parameters);
			},
			async destroy() {
				await removeEventListeners(node);
				resize_observer.disconnect();
				tooltip.$destroy();
			},
			async goToNextNode(next_index: number, next_delay = delay) {
				const props = get(tooltip_parameters);
				const { steps } = props;
				if (steps && steps.length > 0) {
					// Update the node index
					next_index++;
					const next = steps[next_index - 1];
					// Update the tooltip parameters
					setTimeout(async () => {
						const { node, ...rest } = next;
						await reassignNode(node);
						await updater(rest);
						await initializeTooltipPosition();
					}, next_delay);
				}
			}
		};
	} catch (error) {
		if (error instanceof Error) ErrorLog({ error });
	}
}

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
async function getParentPaddings(parent_styles: CSSStyleDeclaration) {
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
	tip_margin_right?: number;
	tip_padding_left?: number;
	parent_styles: CSSStyleDeclaration;
}

async function positionX(input: positionX_params): Promise<number> {
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
export async function positionXAbsolute(input: positionXAbsolute_params): Promise<number> {
	const {
		position,
		horizontal_middle,
		tip_offset_width,
		tip_margin_left = 0,
		tip_margin_right = 0,
		tip_padding_left = 0,
		horizontal_offset = 0,
		parent_styles
	} = input;
	const { parent_padding_left, parent_padding_right } = await getParentPaddings(parent_styles);

	if (position === 'top' || position === 'bottom') {
		return (
			horizontal_middle +
			parent_padding_left +
			tip_padding_left * 2 +
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
async function repositionX(input: positionX_params) {
	let x = await positionX(input);
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
async function positionY(input: positionY_params): Promise<number> {
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
async function positionYAbsolute(input: positionYAbsolute_params) {
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
		await getParentPaddings(parent_styles);

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
async function repositionY(input: positionY_params) {
	let y = await positionY(input);
	const { tip_offset_height } = input;
	const min_margin = 16; // The minimum margin (in px) between the tooltip and the edge of the screen
	const screen_height = window.innerHeight;
	if (y < 0) y = 0 + min_margin;
	if (y + tip_offset_height > screen_height) y = screen_height - tip_offset_height - min_margin;
	return y;
}
