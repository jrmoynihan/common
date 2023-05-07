import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip.js';
import type { SelectOptionList } from './types.js';
import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
declare const __propDef: {
    props: {
        value?: unknown;
        id?: `${string}-${string}-${string}-${string}-${string}` | undefined;
        name?: string | undefined;
        title?: string | undefined;
        required?: boolean | undefined;
        options?: SelectOptionList | undefined;
        select_styles?: string | undefined;
        select_hover_styles?: string | undefined;
        select_focus_styles?: string | undefined;
        select_active_styles?: string | undefined;
        select_container_styles?: string | undefined;
        select_container_hover_styles?: string | undefined;
        select_container_focus_styles?: string | undefined;
        select_container_active_styles?: string | undefined;
        placeholder_props?: {
            placeholder?: string | undefined;
            styles?: string | undefined;
            focus_styles?: string | undefined;
            hover_styles?: string | undefined;
        } | undefined;
        transition?: SvelteTransition | undefined;
        transition_parameters?: SvelteTransitionParams | undefined;
        use_tooltip?: boolean | undefined;
        tooltip_options?: TooltipParameters | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        options: {};
    };
};
export type SelectProps = typeof __propDef.props;
export type SelectEvents = typeof __propDef.events;
export type SelectSlots = typeof __propDef.slots;
export default class Select extends SvelteComponentTyped<SelectProps, SelectEvents, SelectSlots> {
}
export {};
