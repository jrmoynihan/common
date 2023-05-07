import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip.js';
import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
declare const __propDef: {
    props: {
        summary_text?: string | undefined;
        expand_icon_position?: "none" | "left" | "right" | undefined;
        custom_expand_icon?: IconDefinition | null | undefined;
        icon_class?: string | undefined;
        custom_summary_styles?: string | undefined;
        custom_accordion_container_styles?: string | undefined;
        open?: boolean | undefined;
        transition?: SvelteTransition | undefined;
        transition_parameters?: SvelteTransitionParams | undefined;
        closed_icon_rotation?: number | undefined;
        open_icon_rotation?: number | undefined;
        summary_tooltip_parameters?: TooltipParameters | undefined;
        toggle?: (() => boolean) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        summary: {};
        content: {};
    };
};
export type AccordionProps = typeof __propDef.props;
export type AccordionEvents = typeof __propDef.events;
export type AccordionSlots = typeof __propDef.slots;
export default class Accordion extends SvelteComponentTyped<AccordionProps, AccordionEvents, AccordionSlots> {
    get toggle(): () => boolean;
}
export {};
