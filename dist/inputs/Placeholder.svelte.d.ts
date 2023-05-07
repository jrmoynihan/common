import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        placeholder?: string | undefined;
        styles?: string | undefined;
        focus_styles?: string | undefined;
        hover_styles?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PlaceholderProps = typeof __propDef.props;
export type PlaceholderEvents = typeof __propDef.events;
export type PlaceholderSlots = typeof __propDef.slots;
export default class Placeholder extends SvelteComponentTyped<PlaceholderProps, PlaceholderEvents, PlaceholderSlots> {
}
export {};
