import type { ComponentProps } from 'svelte';
import ActionSpotlight from './ActionSpotlight.svelte';
/** Each additional step takes the same parameters as the action itself, but you must also provide a node to move the spotlight to at each step. */
export type SpotlightStep = {
    node: HTMLElement;
} & Omit<ComponentProps<ActionSpotlight>, 'nodes'>;
export type SpotlightParameters = Omit<ComponentProps<ActionSpotlight>, 'nodes'> & {
    /** An optional set of additional nodes & parameters for the spotlight to move to after this initial one.  Useful for showcasing a tour of a screen. */
    steps?: SpotlightStep[];
};
export declare function spotlight(node: HTMLElement, parameters?: SpotlightParameters): {
    update(new_parameters?: SpotlightParameters): Promise<void>;
    destroy(): Promise<void>;
    spotlight: ActionSpotlight;
};
