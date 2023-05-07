import { SvelteComponentTyped } from "svelte";
import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
declare const __propDef: {
    props: {
        refresh: unknown;
        inner_container_styles?: string | undefined;
        inner_container_classes?: string | undefined;
        transition?: SvelteTransition | undefined;
        transition_parameters?: SvelteTransitionParams | undefined;
        in_transition?: SvelteTransition | undefined;
        in_transition_parameters?: SvelteTransitionParams | undefined;
        out_transition?: SvelteTransition | undefined;
        out_transition_parameters?: SvelteTransitionParams | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type TransitionProps = typeof __propDef.props;
export type TransitionEvents = typeof __propDef.events;
export type TransitionSlots = typeof __propDef.slots;
export default class Transition extends SvelteComponentTyped<TransitionProps, TransitionEvents, TransitionSlots> {
}
export {};
