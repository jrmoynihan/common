import { SvelteComponentTyped } from "svelte";
import type { SvelteTransition, SvelteTransitionParams } from '../lib_types.js';
import type { Tab } from './tab.js';
declare const __propDef: {
    props: {
        tabs: Tab[];
        selected_tab: Tab;
        transition?: SvelteTransition | undefined;
        in_transition?: SvelteTransition | undefined;
        out_transition?: SvelteTransition | undefined;
        transition_parameters?: SvelteTransitionParams | undefined;
        in_transition_parameters?: SvelteTransitionParams | undefined;
        out_transition_parameters?: SvelteTransitionParams | undefined;
        tab_container_styles?: string | undefined;
        tab_headers_styles?: string | undefined;
        header_label_styles?: string | undefined;
        header_text_styles?: string | undefined;
        checkForEnterOrSpace?: ((e: KeyboardEvent & {
            currentTarget: EventTarget & HTMLLabelElement;
        }, index: number) => void) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'tab-footer': {};
    };
};
export type TabsProps = typeof __propDef.props;
export type TabsEvents = typeof __propDef.events;
export type TabsSlots = typeof __propDef.slots;
export default class Tabs extends SvelteComponentTyped<TabsProps, TabsEvents, TabsSlots> {
    get checkForEnterOrSpace(): (e: KeyboardEvent & {
        currentTarget: EventTarget & HTMLLabelElement;
    }, index: number) => void;
}
export {};
