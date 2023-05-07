import { SvelteComponentTyped } from "svelte";
import type { SelectOption, SelectOptionGroup } from './types';
declare const __propDef: {
    props: {
        option: SelectOption | SelectOptionGroup;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type OptionOrGroupProps = typeof __propDef.props;
export type OptionOrGroupEvents = typeof __propDef.events;
export type OptionOrGroupSlots = typeof __propDef.slots;
export default class OptionOrGroup extends SvelteComponentTyped<OptionOrGroupProps, OptionOrGroupEvents, OptionOrGroupSlots> {
}
export {};
