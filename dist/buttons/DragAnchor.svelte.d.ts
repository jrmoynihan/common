import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        hovered?: boolean | undefined;
        grabbed?: boolean | undefined;
        styles?: string | undefined;
        focus_styles?: string | undefined;
        hover_styles?: string | undefined;
        active_styles?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type DragAnchorProps = typeof __propDef.props;
export type DragAnchorEvents = typeof __propDef.events;
export type DragAnchorSlots = typeof __propDef.slots;
export default class DragAnchor extends SvelteComponentTyped<DragAnchorProps, DragAnchorEvents, DragAnchorSlots> {
}
export {};
