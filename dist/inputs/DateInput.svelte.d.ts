import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip';
import { fly } from 'svelte/transition';
declare const __propDef: {
    props: {
        /** The date to display */ date: Date;
        min?: Date | undefined;
        max?: Date | undefined;
        name?: string | undefined;
        label_text?: string | undefined;
        label_styles?: string | undefined;
        input_styles?: string | undefined;
        input_hover_styles?: string | undefined;
        input_focus_styles?: string | undefined;
        input_active_styles?: string | undefined;
        input_container_styles?: string | undefined;
        input_container_hover_styles?: string | undefined;
        input_container_focus_styles?: string | undefined;
        input_container_active_styles?: string | undefined;
        invalid_msg?: string | undefined;
        label_position?: "before" | "after" | undefined;
        use_transition?: boolean | undefined;
        transition?: typeof fly | undefined;
        transition_parameters?: {
            duration: number;
            x: number;
        } | undefined;
        date_input?: HTMLInputElement | null | undefined;
        label_element?: HTMLLabelElement | null | undefined;
        is_valid?: boolean | undefined;
        required?: boolean | undefined;
        tooltip_options?: TooltipParameters | null | undefined;
        title?: string | undefined;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        label: {};
    };
};
export type DateInputProps = typeof __propDef.props;
export type DateInputEvents = typeof __propDef.events;
export type DateInputSlots = typeof __propDef.slots;
export default class DateInput extends SvelteComponentTyped<DateInputProps, DateInputEvents, DateInputSlots> {
}
export {};
