import { SvelteComponentTyped } from "svelte";
import { type ComponentProps } from 'svelte';
import AnchorHeading from './AnchorHeading.svelte';
declare const __propDef: {
    props: {
        styles?: string | undefined;
        copied_styles?: string | undefined;
        button_placement?: "before" | "after" | undefined;
        heading_props: ComponentProps<AnchorHeading>;
        button_props?: {
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
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type LinkableAnchorHeadingProps = typeof __propDef.props;
export type LinkableAnchorHeadingEvents = typeof __propDef.events;
export type LinkableAnchorHeadingSlots = typeof __propDef.slots;
export default class LinkableAnchorHeading extends SvelteComponentTyped<LinkableAnchorHeadingProps, LinkableAnchorHeadingEvents, LinkableAnchorHeadingSlots> {
}
export {};
