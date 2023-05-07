import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** Bind this with your store that holds the state for light/dark theme selection */ use_dark_theme?: boolean | undefined;
        button_switch_styles?: string | undefined;
        /** A set of key-value light theme colors */ light_theme_colors?: {
            text: string;
            background: string;
            accent: string;
        } | undefined;
        /** A set of key-value dark theme colors */ dark_theme_colors?: {
            text: string;
            background: string;
            accent: string;
        } | undefined;
        /** The default colors to start with (currently set to dark theme) */ default_colors?: {
            text: string;
            background: string;
            accent: string;
        } | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type LightDarkToggleProps = typeof __propDef.props;
export type LightDarkToggleEvents = typeof __propDef.events;
export type LightDarkToggleSlots = typeof __propDef.slots;
export default class LightDarkToggle extends SvelteComponentTyped<LightDarkToggleProps, LightDarkToggleEvents, LightDarkToggleSlots> {
}
export {};
