export interface DynamicStyleParameters {
    styles?: string;
    hover_styles?: string;
    focus_styles?: string;
    active_styles?: string;
    dynamic_styles?: string;
}
export declare function dynamicStyle(element: HTMLElement, parameters?: DynamicStyleParameters): {
    update(new_parameters: DynamicStyleParameters): void;
    destroy(): void;
};
