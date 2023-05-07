import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        button_parameters?: {
            tooltip_options?: import("..").TooltipParameters | undefined;
            id?: string | undefined;
            role?: import("../lib_types").WidgetRole | undefined;
            styles?: string | undefined;
            classes?: string | undefined;
            hover_styles?: string | undefined;
            focus_styles?: string | undefined;
            active_styles?: string | undefined;
            icon?: import("@fortawesome/fontawesome-common-types").IconDefinition | null | undefined;
            icon_size?: import("../lib_types").IconSize | undefined;
            icon_rotation?: string | number | undefined;
            icon_position?: "before" | "after" | undefined;
            title?: string | undefined;
            disabled?: boolean | undefined;
            text?: string | undefined;
            type?: import("../lib_types").ButtonType | undefined;
            box_shadow_elevation?: import("../lib_types").BoxShadowElevation | undefined;
            transition?: import("../lib_types").SvelteTransition | undefined;
            transition_config?: import("../lib_types").SvelteTransitionParams | undefined;
        } | undefined;
        modal_parameters?: {
            modal_foreground_styles?: string | undefined;
            dialog_styles?: string | undefined;
            dialog_starts_open?: boolean | undefined;
            is_error?: boolean | undefined;
            transition?: import("../lib_types").SvelteTransition | undefined;
            transition_parameters?: import("../lib_types").SvelteTransitionParams | undefined;
            close?: (() => Promise<void>) | undefined;
            open?: (() => Promise<void>) | undefined;
        } | undefined;
        open?: (() => Promise<void>) | undefined;
        close?: (() => Promise<void>) | undefined;
    };
    events: {
        closing: CustomEvent<any>;
        opening: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'button-content': {};
        'modal-content': {};
    };
};
export type ModalWithButtonProps = typeof __propDef.props;
export type ModalWithButtonEvents = typeof __propDef.events;
export type ModalWithButtonSlots = typeof __propDef.slots;
export default class ModalWithButton extends SvelteComponentTyped<ModalWithButtonProps, ModalWithButtonEvents, ModalWithButtonSlots> {
}
export {};
