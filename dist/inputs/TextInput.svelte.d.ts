import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip.js';
import type { DatalistOption } from './types.js';
import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
declare const __propDef: {
    props: {
        value?: unknown;
        id?: `${string}-${string}-${string}-${string}-${string}` | undefined;
        type?: "text" | "datalist" | undefined;
        title?: string | undefined;
        required?: boolean | undefined;
        pattern?: RegExp | null | undefined;
        list?: `${string}-${string}-${string}-${string}-${string}` | undefined;
        show_confirm?: boolean | undefined;
        show_cancel?: boolean | undefined;
        options?: DatalistOption[] | undefined;
        input_container_styles?: string | undefined;
        input_container_hover_styles?: string | undefined;
        input_container_focus_styles?: string | undefined;
        input_container_active_styles?: string | undefined;
        input_styles?: string | undefined;
        input_hover_styles?: string | undefined;
        input_focus_styles?: string | undefined;
        input_active_styles?: string | undefined;
        button_styles?: string | undefined;
        button_hover_styles?: string | undefined;
        button_focus_styles?: string | undefined;
        button_active_styles?: string | undefined;
        placeholder_props?: {
            placeholder?: string | undefined;
            styles?: string | undefined;
            focus_styles?: string | undefined;
            hover_styles?: string | undefined;
        } | undefined;
        transition?: SvelteTransition | undefined;
        transition_parameters?: SvelteTransitionParams | undefined;
        tooltip_options?: TooltipParameters | null | undefined;
        custom_validity_function?: ((arg0: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }) => void) | null | undefined;
    };
    events: {
        confirm: CustomEvent<any>;
        input: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type TextInputProps = typeof __propDef.props;
export type TextInputEvents = typeof __propDef.events;
export type TextInputSlots = typeof __propDef.slots;
export default class TextInput extends SvelteComponentTyped<TextInputProps, TextInputEvents, TextInputSlots> {
}
export {};
