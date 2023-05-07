import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        id: string;
        text: string;
        header_type?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type AnchorHeadingProps = typeof __propDef.props;
export type AnchorHeadingEvents = typeof __propDef.events;
export type AnchorHeadingSlots = typeof __propDef.slots;
export default class AnchorHeading extends SvelteComponentTyped<AnchorHeadingProps, AnchorHeadingEvents, AnchorHeadingSlots> {
}
export {};
