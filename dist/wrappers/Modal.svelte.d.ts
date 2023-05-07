import { SvelteComponentTyped } from "svelte";
import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
declare const __propDef: {
    props: {
        modal_foreground_styles?: string | undefined;
        dialog_styles?: string | undefined;
        /** Should the dialog initialize open by default? */ dialog_starts_open?: boolean | undefined;
        /** Is it an error modal? */ is_error?: boolean | undefined;
        /** The Svelte transition to use for animation the modal opening/closing */ transition?: SvelteTransition | undefined;
        /** The transition parameters to use */ transition_parameters?: SvelteTransitionParams | undefined;
        /** Exposed binding for closing the modal */ close?: (() => Promise<void>) | undefined;
        /** Exposed binding for opening the modal */ open?: (() => Promise<void>) | undefined;
    };
    events: {
        keypress: KeyboardEvent;
        closing: CustomEvent<any>;
        opening: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'modal-content': {};
    };
};
export type ModalProps = typeof __propDef.props;
export type ModalEvents = typeof __propDef.events;
export type ModalSlots = typeof __propDef.slots;
export default class Modal extends SvelteComponentTyped<ModalProps, ModalEvents, ModalSlots> {
    get close(): () => Promise<void>;
    get open(): () => Promise<void>;
}
export {};
