import { tooltip, type TooltipParameters } from './tooltip/tooltip.js';
import { spotlight, type SpotlightParameters } from './spotlight/spotlight.js';
export declare function waitForAnimations(ticking: boolean): Promise<void>;
export declare function tutorial(node: HTMLElement, parameters: {
    spotlight: SpotlightParameters;
    tooltip: TooltipParameters;
}): {
    update(parameters: {
        spotlight: SpotlightParameters;
        tooltip: TooltipParameters;
    }): Promise<void>;
    destroy(): void;
};
