import { SvelteComponentTyped } from "svelte";
import { type TooltipDirections, type TooltipParameters } from '../actions/tooltip/tooltip.js';
import { Temporal } from '@js-temporal/polyfill';
import { fly } from 'svelte/transition';
declare const __propDef: {
    props: {
        /** The date to display */ date?: Temporal.ZonedDateTime | undefined;
        type?: "date" | "datetime" | "datetime-local" | "time" | undefined;
        min?: Temporal.ZonedDateTime | undefined;
        max?: Temporal.ZonedDateTime | undefined;
        name?: string | undefined;
        label_text?: string | undefined;
        label_styles?: string | undefined;
        input_styles?: string | undefined;
        invalid_msg?: string | null | undefined;
        invalid_msg_position?: TooltipDirections | undefined;
        tooltip_options?: TooltipParameters | undefined;
        invalid_tooltip_styles?: string | undefined;
        label_position?: "before" | "after" | undefined;
        use_transition?: boolean | undefined;
        transition?: typeof fly | undefined;
        transition_params?: {
            duration: number;
            x: number;
        } | undefined;
        dateInput?: HTMLInputElement | null | undefined;
        is_valid?: boolean | undefined;
        required?: boolean | undefined;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'label-text': {};
    };
};
export type TemporalDateInputProps = typeof __propDef.props;
export type TemporalDateInputEvents = typeof __propDef.events;
export type TemporalDateInputSlots = typeof __propDef.slots;
export default class TemporalDateInput extends SvelteComponentTyped<TemporalDateInputProps, TemporalDateInputEvents, TemporalDateInputSlots> {
}
export {};
