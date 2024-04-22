import type { DynamicStyleParameters } from '$actions/dynamic-styles';
import type { TooltipProps } from '$actions/tooltip/tooltip.svelte';
import type Placeholder from '$inputs/Placeholder.svelte';
import type { Temporal } from '@js-temporal/polyfill';
import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';
import type {
	BlurParams,
	FadeParams,
	FlyParams,
	ScaleParams,
	SlideParams,
	TransitionConfig
} from 'svelte/transition';
export interface SelectOption {
	value: unknown;
	text?: string;
	disabled?: boolean;
}
export interface SelectOptionGroup {
	options: SelectOption[];
	label?: string;
}
export interface InputLabelProps {
	/** Anything rendered within the input label */
	children?: Snippet<[any]>;
	/**  Attributes on the `<label>` element that wraps the input. */
	label_attributes?: HTMLLabelAttributes;
	label_element?: HTMLLabelElement;
	label_text?: string;
	label_position?: 'before' | 'after';
	label_snippet?: Snippet<[any]>;
	invalid_text?: string;
	id?: string;
	invalid_msg_transition_types?: TransitionTypes[];
	invalid_msg_snippet?: Snippet<[any]>;
	valid?: boolean;
	placeholder_props?: ComponentProps<Placeholder>;
	tooltip_options?: TooltipProps;
	dynamic_styles?: DynamicStyleParameters;
	title?: string;
	transition?: SvelteTransition;
	transition_parameters?: SvelteTransitionParams;
}
export interface DateInputProps {
	date?: Temporal.ZonedDateTime;
	min?: Temporal.ZonedDateTime;
	max?: Temporal.ZonedDateTime;
	label_props?: InputLabelProps;
	input_attributes?: HTMLInputAttributes;
	input_dynamic_styles?: DynamicStyleParameters;
	is_valid?: boolean;
	on_input?: () => void | Promise<void>;
	date_input?: HTMLInputElement;
	label_element?: HTMLLabelElement;
}
export type SelectOptionList = (SelectOption | SelectOptionGroup)[];

export type IconSize =
	| 'xs'
	| 'sm'
	| 'lg'
	| '1x'
	| '2x'
	| '3x'
	| '4x'
	| '5x'
	| '6x'
	| '7x'
	| '8x'
	| '9x'
	| '10x';
export type SvelteTransitionParams = BlurParams &
	FadeParams &
	FlyParams &
	ScaleParams &
	SlideParams;
export type SvelteTransition = (node: Element, {}: SvelteTransitionParams) => TransitionConfig;
export type BoxShadowElevation = 'none' | 'low' | 'medium' | 'high';
export type ButtonType = 'submit' | 'reset' | 'button';
export type TransitionTypes = 'fly' | 'fade' | 'blur' | 'slide' | 'scale' | 'combo';
export type SlideSide = 'left' | 'right' | 'top' | 'bottom';
/** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques */
// export type WidgetRole =
// 	| 'button'
// 	| 'checkbox'
// 	| 'gridcell'
// 	| 'link'
// 	| 'menuitem'
// 	| 'menuitemcheckbox'
// 	| 'menuitemradio'
// 	| 'option'
// 	| 'progressbar'
// 	| 'radio'
// 	| 'scrollbar'
// 	| 'searchbox'
// 	| 'separator'
// 	| 'slider'
// 	| 'spinbutton'
// 	| 'switch'
// 	| 'tab'
// 	| 'tabpanel'
// 	| 'textbox'
// 	| 'treeitem';
/** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques */
export type CompositeRole =
	| 'combobox'
	| 'grid'
	| 'listbox'
	| 'menu'
	| 'menubar'
	| 'radiogroup'
	| 'tablist'
	| 'tree'
	| 'treegrid';
/** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques */
export type DocumentStructureRole =
	| 'application'
	| 'article'
	| 'cell'
	| 'columnheader'
	| 'definition'
	| 'directory'
	| 'document'
	| 'feed'
	| 'figure'
	| 'group'
	| 'heading'
	| 'img'
	| 'list'
	| 'listitem'
	| 'math'
	| 'none'
	| 'note'
	| 'presentation'
	| 'row'
	| 'rowgroup'
	| 'rowheader'
	| 'separator'
	| 'table'
	| 'term'
	| 'toolbar'
	| 'tooltip';
export type LandmarkRole =
	| 'banner'
	| 'complementary'
	| 'contentinfo'
	| 'form'
	| 'main'
	| 'navigation'
	| 'region'
	| 'search';
export type LiveRegionRole = 'alert' | 'log' | 'marquee' | 'status' | 'timer';
export type WidgetAttributes =
	| 'aria-autocomplete'
	| 'aria-checked'
	| 'aria-current'
	| 'aria-disabled'
	| 'aria-errormessage'
	| 'aria-expanded'
	| 'aria-haspopup'
	| 'aria-hidden'
	| 'aria-invalid'
	| 'aria-label'
	| 'aria-level'
	| 'aria-modal'
	| 'aria-multiline'
	| 'aria-multiselectable'
	| 'aria-orientation'
	| 'aria-placeholder'
	| 'aria-pressed'
	| 'aria-readonly'
	| 'aria-required'
	| 'aria-selected'
	| 'aria-sort'
	| 'aria-valuemax'
	| 'aria-valuemin'
	| 'aria-valuenow'
	| 'aria-valuetext';
export type LiveRegionAttributes = 'aria-live' | 'aria-relevant' | 'aria-atomic' | 'aria-busy';
export type RelationshipAttributes =
	| 'aria-activedescendant'
	| 'aria-colcount'
	| 'aria-colindex'
	| 'aria-colspan'
	| 'aria-controls'
	| 'aria-describedby'
	| 'aria-details'
	| 'aria-errormessage'
	| 'aria-flowto'
	| 'aria-labelledby'
	| 'aria-owns'
	| 'aria-posinset'
	| 'aria-rowcount'
	| 'aria-rowindex'
	| 'aria-rowspan'
	| 'aria-setsize';
