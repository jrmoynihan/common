import { SvelteComponentTyped } from "svelte";
import type { IconSize } from '../lib_types.js';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
declare const __propDef: {
    props: {
        title?: string | undefined;
        msg?: string | undefined;
        text_styles?: string | undefined;
        header_styles?: string | undefined;
        icon?: IconDefinition | null | undefined;
        icon_size?: IconSize | undefined;
        icon_color?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type DefaultToastProps = typeof __propDef.props;
export type DefaultToastEvents = typeof __propDef.events;
export type DefaultToastSlots = typeof __propDef.slots;
export default class DefaultToast extends SvelteComponentTyped<DefaultToastProps, DefaultToastEvents, DefaultToastSlots> {
}
export {};
