import type { ComponentProps, ComponentType, SvelteComponentTyped } from 'svelte';
import ActionTooltip from './ActionTooltip.svelte';
export type TooltipDirections = 'top' | 'bottom' | 'left' | 'right';
/** Each additional step takes the same parameters as the action itself, but you must also provide a node to move the tooltips to at each step. */
export type TooltipStep = {
    node: HTMLElement;
} & Omit<TooltipParameters, 'nodes'>;
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
    custom_component?: ComponentType<SvelteComponentTyped>;
    /** Disabling the tooltip prevents it from appearing on mouseover events. */
    disabled?: boolean;
    /** The additional nodes to travel to after closing the initial spotlight. */
    steps?: TooltipStep[];
}
export declare function tooltip(node: HTMLElement, parameters?: TooltipParameters): {
    update(new_parameters: TooltipParameters): Promise<void>;
    destroy(): Promise<void>;
    goToNextNode(next_index: number, next_delay?: number): Promise<void>;
} | undefined;
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
export declare function positionXAbsolute(input: positionXAbsolute_params): Promise<number>;
export {};
