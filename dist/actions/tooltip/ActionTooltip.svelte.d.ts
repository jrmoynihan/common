import { SvelteComponentTyped } from "svelte";
import type { TooltipDirections } from './tooltip.js';
import { scale, type EasingFunction, type FadeParams, type FlyParams, type ScaleParams, type SlideParams, type TransitionConfig } from 'svelte/transition';
declare const __propDef: {
    props: {
        /** The text content of the tooltip.  Will be set as the title attribute after the tooltip is hidden. */ title?: string | undefined;
        /** Choose from top, bottom, right, left anchor positions for the tooltip. */ position?: TooltipDirections | undefined;
        position_type?: "fixed" | "absolute" | undefined;
        x?: number | undefined;
        y?: number | undefined;
        /** Allow the tooltip to start visible when mounted to the DOM and programmatically trigger its visibility. May be useful for e.g. guided tour interactions. */ visible?: boolean | undefined;
        start?: number | undefined;
        opacity?: number | undefined;
        /** Duration of the in/out transition of the tooltip.  An explicit transition config will override this! */ duration?: number | undefined;
        /** Delay the entrnace and exit transition of the tooltip symmetrically.  An explicit transition config's delay property will override this! */ delay?: number | undefined;
        /** Easing function of the in/out transition of the tooltip.  An explicit transition config will override this! */ easing?: EasingFunction | undefined;
        offsetHeight?: number | undefined;
        clientHeight?: number | undefined;
        clientWidth?: number | undefined;
        offsetWidth?: number | undefined;
        marginTop?: number | undefined;
        marginLeft?: number | undefined;
        marginRight?: number | undefined;
        marginBottom?: number | undefined;
        paddingTop?: number | undefined;
        paddingBottom?: number | undefined;
        paddingLeft?: number | undefined;
        paddingRight?: number | undefined;
        custom_component?: ConstructorOfATypedSvelteComponent | null | undefined;
        /** Enable or disable the tooltip arrow */ show_arrow?: boolean | undefined;
        /** Allow the tooltip to stay visible even after the user moves the mouse outside the parent element. */ keep_visible?: boolean | undefined;
        only_for_measuring?: boolean | undefined;
        /** A Svelte transition to use on the tooltip */ transition?: typeof scale | undefined;
        /** A transition config for a Svelte transition. Will override delay, duration, easing props on the tooltip action. */ transition_config?: FadeParams | FlyParams | ScaleParams | SlideParams | TransitionConfig | undefined;
        /** Dynamic styles that can change on the tooltip.  Note: use '--tooltip'-prefixed CSS custom properties wherever possible (e.g. --tooltip-background: 'white' instead of background: 'white'). */ styles?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ActionTooltipProps = typeof __propDef.props;
export type ActionTooltipEvents = typeof __propDef.events;
export type ActionTooltipSlots = typeof __propDef.slots;
export default class ActionTooltip extends SvelteComponentTyped<ActionTooltipProps, ActionTooltipEvents, ActionTooltipSlots> {
    get title(): string | undefined;
    /**accessor*/
    set title(_: string | undefined);
    get position(): TooltipDirections | undefined;
    /**accessor*/
    set position(_: TooltipDirections | undefined);
    get position_type(): "fixed" | "absolute" | undefined;
    /**accessor*/
    set position_type(_: "fixed" | "absolute" | undefined);
    get x(): number | undefined;
    /**accessor*/
    set x(_: number | undefined);
    get y(): number | undefined;
    /**accessor*/
    set y(_: number | undefined);
    get visible(): boolean | undefined;
    /**accessor*/
    set visible(_: boolean | undefined);
    get start(): number | undefined;
    /**accessor*/
    set start(_: number | undefined);
    get opacity(): number | undefined;
    /**accessor*/
    set opacity(_: number | undefined);
    get duration(): number | undefined;
    /**accessor*/
    set duration(_: number | undefined);
    get delay(): number | undefined;
    /**accessor*/
    set delay(_: number | undefined);
    get easing(): EasingFunction | undefined;
    /**accessor*/
    set easing(_: EasingFunction | undefined);
    get offsetHeight(): number | undefined;
    /**accessor*/
    set offsetHeight(_: number | undefined);
    get clientHeight(): number | undefined;
    /**accessor*/
    set clientHeight(_: number | undefined);
    get clientWidth(): number | undefined;
    /**accessor*/
    set clientWidth(_: number | undefined);
    get offsetWidth(): number | undefined;
    /**accessor*/
    set offsetWidth(_: number | undefined);
    get marginTop(): number | undefined;
    /**accessor*/
    set marginTop(_: number | undefined);
    get marginLeft(): number | undefined;
    /**accessor*/
    set marginLeft(_: number | undefined);
    get marginRight(): number | undefined;
    /**accessor*/
    set marginRight(_: number | undefined);
    get marginBottom(): number | undefined;
    /**accessor*/
    set marginBottom(_: number | undefined);
    get paddingTop(): number | undefined;
    /**accessor*/
    set paddingTop(_: number | undefined);
    get paddingBottom(): number | undefined;
    /**accessor*/
    set paddingBottom(_: number | undefined);
    get paddingLeft(): number | undefined;
    /**accessor*/
    set paddingLeft(_: number | undefined);
    get paddingRight(): number | undefined;
    /**accessor*/
    set paddingRight(_: number | undefined);
    get custom_component(): ConstructorOfATypedSvelteComponent | null | undefined;
    /**accessor*/
    set custom_component(_: ConstructorOfATypedSvelteComponent | null | undefined);
    get show_arrow(): boolean | undefined;
    /**accessor*/
    set show_arrow(_: boolean | undefined);
    get keep_visible(): boolean | undefined;
    /**accessor*/
    set keep_visible(_: boolean | undefined);
    get only_for_measuring(): boolean | undefined;
    /**accessor*/
    set only_for_measuring(_: boolean | undefined);
    get transition(): typeof scale | undefined;
    /**accessor*/
    set transition(_: typeof scale | undefined);
    get transition_config(): FadeParams | FlyParams | ScaleParams | SlideParams | TransitionConfig | undefined;
    /**accessor*/
    set transition_config(_: FadeParams | FlyParams | ScaleParams | SlideParams | TransitionConfig | undefined);
    get styles(): string | undefined;
    /**accessor*/
    set styles(_: string | undefined);
}
export {};
