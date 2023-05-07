import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        checked?: boolean | undefined;
        disabled?: boolean | undefined;
        label_position?: "before" | "after" | undefined;
        label_text?: string | undefined;
        slider_text?: string | undefined;
        scale?: string | undefined;
        slider_styles?: string | undefined;
        label_styles?: string | undefined;
        label_hover_styles?: string | undefined;
        label_focus_styles?: string | undefined;
        label_active_styles?: string | undefined;
        /** Properties of the {@link Button} container.  This is also where you can add an icon. */ button_props?: {
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
        bgColorHue?: number | null | undefined;
        bgColorSaturation?: number | null | undefined;
        bgColorLuminosity?: number | null | undefined;
        darkenHoverPercentage?: number | undefined;
        inactiveBgColorHue?: number | undefined;
        inactiveBgColorSaturation?: number | undefined;
        inactiveBgColorLuminosity?: number | undefined;
        inactiveBgColor?: string | undefined;
        inactiveBgColorDarken?: string | undefined;
        toggleBgColorActive?: string | null | undefined;
        toggleBgColorActiveHovered?: string | null | undefined;
    };
    events: {
        toggle: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ToggleSwitchProps = typeof __propDef.props;
export type ToggleSwitchEvents = typeof __propDef.events;
export type ToggleSwitchSlots = typeof __propDef.slots;
export default class ToggleSwitch extends SvelteComponentTyped<ToggleSwitchProps, ToggleSwitchEvents, ToggleSwitchSlots> {
}
export {};
