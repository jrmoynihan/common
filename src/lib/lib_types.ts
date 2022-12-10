import type {
	BlurParams,
	FadeParams,
	FlyParams,
	ScaleParams,
	SlideParams,
	TransitionConfig
} from 'svelte/transition';

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
/** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques */
export type WidgetRole =
	| 'button'
	| 'checkbox'
	| 'gridcell'
	| 'link'
	| 'menuitem'
	| 'menuitemcheckbox'
	| 'menuitemradio'
	| 'option'
	| 'progressbar'
	| 'radio'
	| 'scrollbar'
	| 'searchbox'
	| 'separator'
	| 'slider'
	| 'spinbutton'
	| 'switch'
	| 'tab'
	| 'tabpanel'
	| 'textbox'
	| 'treeitem';
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
