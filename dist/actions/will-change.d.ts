export type WillChangeParameters = {
    properties: string;
    type: WillChangeTypes;
};
export type WillChangeTypes = 'mouse' | 'transition' | 'page-load';
export declare function willChange(element: HTMLElement, parameters: WillChangeParameters): {
    update(new_parameters: WillChangeParameters): void;
    destroy(): void;
};
