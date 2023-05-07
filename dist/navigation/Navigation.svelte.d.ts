import { SvelteComponentTyped } from "svelte";
import type { TooltipParameters } from '../actions/tooltip/tooltip.js';
import type { NavigationLink } from './nav-functions.js';
declare const __propDef: {
    props: {
        /** An array of items to display within the nav wrapper element */ nav_links?: NavigationLink[] | undefined;
        /** Styles for the <nav> parent element */ styles?: string | undefined;
        /** Hover styles for the <nav> parent element */ hover_styles?: string | undefined;
        /** Focus styles for the <nav> parent element */ focus_styles?: string | undefined;
        /** Active styles for the <nav> parent element*/ active_styles?: string | undefined;
        /** Styles to pass to the individual nav links */ nav_link_styles?: string | undefined;
        /** Hover styles to pass to the individual nav links */ nav_link_hover_styles?: string | undefined;
        /** Focus syles to pass to the individual nav links */ nav_link_focus_styles?: string | undefined;
        /** Active styles to pass to the individual nav links */ nav_link_active_styles?: string | undefined;
        /** Styles to apply to the link if it is part of the current page path */ nav_link_current_page_styles?: string | undefined;
        /** The tooltip options for all parameters, or an array of tooltip options.  Each item of the options array will be passed into each respective nav item.*/ tooltip_options?: TooltipParameters | TooltipParameters[] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type NavigationProps = typeof __propDef.props;
export type NavigationEvents = typeof __propDef.events;
export type NavigationSlots = typeof __propDef.slots;
export default class Navigation extends SvelteComponentTyped<NavigationProps, NavigationEvents, NavigationSlots> {
}
export {};
