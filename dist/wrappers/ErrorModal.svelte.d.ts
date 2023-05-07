import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        error?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            slot: string;
        };
    };
};
export type ErrorModalProps = typeof __propDef.props;
export type ErrorModalEvents = typeof __propDef.events;
export type ErrorModalSlots = typeof __propDef.slots;
export default class ErrorModal extends SvelteComponentTyped<ErrorModalProps, ErrorModalEvents, ErrorModalSlots> {
}
export {};
