import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        width?: number | undefined;
        height?: number | undefined;
        top?: number | undefined;
        left?: number | undefined;
        padding?: number | undefined;
        padding_width?: number | undefined;
        padding_height?: number | undefined;
        visible?: boolean | undefined;
        delay?: number | undefined;
        duration?: number | undefined;
        opacity?: number | undefined;
        color?: string | undefined;
        soft_edges?: boolean | undefined;
        soft_edge_distance?: string | undefined;
        /**
             * The shape the spotlight will take.
             * @default circle
            */ shape?: "circle" | "ellipse" | "square" | undefined;
        /** The additional nodes to travel to after closing the initial spotlight. */ nodes?: HTMLElement[] | undefined;
        node_index?: number | undefined;
        onClose?: (() => void) | undefined;
        onOpen?: (() => void) | undefined;
        close?: (() => Promise<void>) | undefined;
        open?: (() => Promise<void>) | undefined;
        reposition?: (() => Promise<void>) | undefined;
        moveToNextNode?: (() => Promise<void>) | undefined;
        nextNodeOrClose?: (() => Promise<void>) | undefined;
    };
    events: {
        next: CustomEvent<any>;
        closeAll: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ActionSpotlightProps = typeof __propDef.props;
export type ActionSpotlightEvents = typeof __propDef.events;
export type ActionSpotlightSlots = typeof __propDef.slots;
export default class ActionSpotlight extends SvelteComponentTyped<ActionSpotlightProps, ActionSpotlightEvents, ActionSpotlightSlots> {
    get close(): () => Promise<void>;
    get open(): () => Promise<void>;
    get reposition(): () => Promise<void>;
    get moveToNextNode(): () => Promise<void>;
    get nextNodeOrClose(): () => Promise<void>;
    get width(): number | undefined;
    /**accessor*/
    set width(_: number | undefined);
    get height(): number | undefined;
    /**accessor*/
    set height(_: number | undefined);
    get top(): number | undefined;
    /**accessor*/
    set top(_: number | undefined);
    get left(): number | undefined;
    /**accessor*/
    set left(_: number | undefined);
    get padding(): number | undefined;
    /**accessor*/
    set padding(_: number | undefined);
    get padding_width(): number | undefined;
    /**accessor*/
    set padding_width(_: number | undefined);
    get padding_height(): number | undefined;
    /**accessor*/
    set padding_height(_: number | undefined);
    get visible(): boolean | undefined;
    /**accessor*/
    set visible(_: boolean | undefined);
    get delay(): number | undefined;
    /**accessor*/
    set delay(_: number | undefined);
    get duration(): number | undefined;
    /**accessor*/
    set duration(_: number | undefined);
    get opacity(): number | undefined;
    /**accessor*/
    set opacity(_: number | undefined);
    get color(): string | undefined;
    /**accessor*/
    set color(_: string | undefined);
    get soft_edges(): boolean | undefined;
    /**accessor*/
    set soft_edges(_: boolean | undefined);
    get soft_edge_distance(): string | undefined;
    /**accessor*/
    set soft_edge_distance(_: string | undefined);
    get shape(): "circle" | "ellipse" | "square" | undefined;
    /**accessor*/
    set shape(_: "circle" | "ellipse" | "square" | undefined);
    get nodes(): HTMLElement[] | undefined;
    /**accessor*/
    set nodes(_: HTMLElement[] | undefined);
    get node_index(): number | undefined;
    /**accessor*/
    set node_index(_: number | undefined);
    get onClose(): (() => void) | undefined;
    /**accessor*/
    set onClose(_: (() => void) | undefined);
    get onOpen(): (() => void) | undefined;
    /**accessor*/
    set onOpen(_: (() => void) | undefined);
    get undefined(): any;
    /**accessor*/
    set undefined(_: any);
    get undefined(): any;
    /**accessor*/
    set undefined(_: any);
    get undefined(): any;
    /**accessor*/
    set undefined(_: any);
    get undefined(): any;
    /**accessor*/
    set undefined(_: any);
    get undefined(): any;
    /**accessor*/
    set undefined(_: any);
}
export {};
