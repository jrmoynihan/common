import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip.js';
import { fly, type BlurParams, type FadeParams, type FlyParams, type ScaleParams, type SlideParams } from 'svelte/transition';
declare const __propDef: {
    props: {
        numeric_input?: HTMLInputElement | null | undefined;
        value?: string | number | string[] | null | undefined;
        min?: string | number | undefined;
        max?: string | number | undefined;
        step?: number | null | undefined;
        placeholder?: string | undefined;
        name?: string | undefined;
        title?: string | undefined;
        id?: string | undefined;
        invalid_msg?: string | undefined;
        required?: boolean | undefined;
        is_valid?: boolean | undefined;
        show_spinner_buttons?: boolean | undefined;
        tooltip_options?: TooltipParameters | null | undefined;
        container_styles?: string | undefined;
        container_hover_styles?: string | undefined;
        container_focus_styles?: string | undefined;
        container_dynamic_styles?: string | undefined;
        input_styles?: string | undefined;
        input_hover_styles?: string | undefined;
        input_focus_styles?: string | undefined;
        /** Dynamically reactive styles to apply.  Invalid input styles automatically get appended to this. */ input_dynamic_stles?: string | undefined;
        /** Styles for when the input fails its validity test */ invalid_input_styles?: string | undefined;
        pattern?: string | null | undefined;
        placeholder_props?: {
            placeholder?: string | undefined;
            styles?: string | undefined;
            focus_styles?: string | undefined;
            hover_styles?: string | undefined;
        } | undefined;
        svelteTransition?: typeof fly | undefined;
        transitionParams?: BlurParams | FadeParams | FlyParams | ScaleParams | SlideParams | undefined;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NumericInputProps = typeof __propDef.props;
export type NumericInputEvents = typeof __propDef.events;
export type NumericInputSlots = typeof __propDef.slots;
export default class NumericInput extends SvelteComponentTyped<NumericInputProps, NumericInputEvents, NumericInputSlots> {
}
export {};
