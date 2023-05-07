import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip.js';
import type { BoxShadowElevation, ButtonType, IconSize, SvelteTransition, SvelteTransitionParams, WidgetRole } from '../lib_types.js';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
declare const __propDef: {
    props: {
        /** Options to style the tooltip or modify its visible/disabled state */ tooltip_options?: TooltipParameters | undefined;
        id?: string | undefined;
        /** Add role attributes to the button */ role?: WidgetRole | undefined;
        /** Style the button, allowing dynamic updates */ styles?: string | undefined;
        /** External classes to add to the button (typically, these are best done by wrapping a Button and passing in specific styles, making a styled component) */ classes?: string | undefined;
        /** An array of hover CSS styles rules and values to apply to the button */ hover_styles?: string | undefined;
        /** An array of focus CSS styles rules and values to apply to the button.  (default: uses the same styles as hover state). */ focus_styles?: string | undefined;
        /** An array of `:active` CSS styles rules and values to apply to the button when it is activated. */ active_styles?: string | undefined;
        /** A font-awwesome icon to use inside the button */ icon?: IconDefinition | null | undefined;
        /** The size of the icon */ icon_size?: IconSize | undefined;
        /** The rotation of the icon */ icon_rotation?: string | number | undefined;
        /** Should the icon be positioned before or after the text and slot of the button (default: 'after')*/ icon_position?: "before" | "after" | undefined;
        /** The title of the button */ title?: string | undefined;
        /** Whether the button is disabled */ disabled?: boolean | undefined;
        /** Plain text to display within the button */ text?: string | undefined;
        /** The type of the button. Possible values are:
             * * `submit`: The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.
             * * `reset`: The button resets all the controls to their initial values.
             * * `button`: The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur. */ type?: ButtonType | undefined;
        /** What height the box-shadows should convey to the element */ box_shadow_elevation?: BoxShadowElevation | undefined;
        /** A Svelte transition to use on the button */ transition?: SvelteTransition | undefined;
        transition_config?: SvelteTransitionParams | undefined;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ButtonProps = typeof __propDef.props;
export type ButtonEvents = typeof __propDef.events;
export type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
