import { SvelteComponentTyped } from "svelte";
import { type TooltipParameters } from '../actions/tooltip/tooltip.js';
import type { IconSize, PullDirection } from '@jrmoynihan/svelte-fa/utils.js';
import type { NavigationLink } from './nav-functions.js';
declare const __propDef: {
    props: {
        /** The entire Navlink instance */ nav_link: NavigationLink;
        /** Tooltip options to apply to the nav links. If an array is passed, each options object will be applied to each link, individually.  Must pass the index in the array, `i` as well!  */ tooltip_options?: TooltipParameters | TooltipParameters[] | undefined;
        /** Is the link the currently active page/url? */ is_current_page?: boolean | undefined;
        /** Index used to access tooltip options from an array */ i?: number | undefined;
        /** Static styles to apply to the links. Will be re-applied when hover, focus, current-page status is lost*/ styles?: string | undefined;
        /** Styles to apply to a link when it is the active page URL. */ current_page_styles?: string | undefined;
        /** Hover styles to apply to the links. */ hover_styles?: string | undefined;
        /** Focus styles to apply to the links. */ focus_styles?: string | undefined;
        /** Active styles to apply to the links */ active_styles?: string | undefined;
        /** Is the link hovered? */ hovered?: boolean | undefined;
        /** Is the link focused? */ focused?: boolean | undefined;
        /** The tab index (only set if necessary!) */ tabindex?: number | undefined;
        /** */ layers_container_props?: {
            class?: string | undefined;
            id?: string | undefined;
            style?: string | undefined;
            size?: IconSize | undefined;
            pull?: PullDirection | undefined;
        } | undefined;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NavLinkProps = typeof __propDef.props;
export type NavLinkEvents = typeof __propDef.events;
export type NavLinkSlots = typeof __propDef.slots;
export default class NavLink extends SvelteComponentTyped<NavLinkProps, NavLinkEvents, NavLinkSlots> {
}
export {};
