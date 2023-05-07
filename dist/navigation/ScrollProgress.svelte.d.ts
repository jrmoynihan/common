import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** Style or modify the Return To Top button */ button_props?: {
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
        /** The percent at which the scroll-to-top button becomes visible.  E.g., 10% would be 10*/ threshold?: number | undefined;
        /** The scroll progess up and down the page, expressed as a percent. */ progress?: import("svelte/motion").Spring<number> | undefined;
        /** Should a return-to-top button be shown when the scroll progress passes the given threshold? */ show_return_to_top_button?: boolean | undefined;
        /** Should a scroll progess bar be displayed on the page? */ show_progress_bar?: boolean | undefined;
        /** Should a conical radiaul display the scroll progress on the page? */ show_progress_radial?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ScrollProgressProps = typeof __propDef.props;
export type ScrollProgressEvents = typeof __propDef.events;
export type ScrollProgressSlots = typeof __propDef.slots;
export default class ScrollProgress extends SvelteComponentTyped<ScrollProgressProps, ScrollProgressEvents, ScrollProgressSlots> {
    get progress(): import("svelte/motion").Spring<number>;
}
export {};
