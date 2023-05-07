import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        title?: string | undefined;
        msg?: string | undefined;
        local_storage_key?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SeenToastProps = typeof __propDef.props;
export type SeenToastEvents = typeof __propDef.events;
export type SeenToastSlots = typeof __propDef.slots;
export default class SeenToast extends SvelteComponentTyped<SeenToastProps, SeenToastEvents, SeenToastSlots> {
}
export {};
