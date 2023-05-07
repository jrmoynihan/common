import type { IconDefinition } from '@fortawesome/free-solid-svg-icons/index';
import type { NavigationTarget, Page } from '@sveltejs/kit';
import type { IconSize } from '../lib_types.js';
interface INavigationLink {
    url: URL;
    link_text?: string;
    icons?: IconLayer[];
    anchors?: NavigationLink[];
}
export type IconLayer = {
    icon?: IconDefinition;
    size?: IconSize;
    translateX?: number;
    translateY?: number;
    color?: string;
    text?: string;
    scale?: number;
    style?: string;
};
export declare class NavigationLink {
    /** The URL object describing the link */
    url: URL;
    /** The displayed text for the link (defaults to the link's pathname)*/
    link_text: string;
    /** Pass in an array of icons to use in a FaLayer component. */
    icons: IconLayer[] | undefined;
    /** Pass in an array of NavigationLinks to use as anchors for the link. */
    anchors: NavigationLink[] | undefined;
    /** Whether or not the link is the current page.  Can update with the `isCurrentPage()` method. */
    is_current_page: boolean;
    constructor(args: INavigationLink);
    getLastSegment: (pathname: string) => string;
    isCurrentPage: (page: Page<Record<string, string>, string | null>) => boolean;
}
export interface makeNavLinksOptions {
    paths: string[];
    make_anchors?: boolean;
    parent_path?: string;
    link_texts?: string[];
    link_icons?: IconLayer[][];
    anchors?: NavigationLink[];
}
export declare function makeAnchorLinks(input: makeNavLinksOptions): Promise<NavigationLink[]>;
export declare function makeNavLinks(input: makeNavLinksOptions): Promise<NavigationLink[]>;
export declare function makeLinks(input: makeNavLinksOptions): Promise<NavigationLink[]>;
/** Compares the navigation targets (from and to) and returns true if layout should transition, and false if it should not */
export declare function shouldLayoutTransitionOnNavigation(from: NavigationTarget, to: NavigationTarget, layout_parent: string): Promise<boolean | undefined>;
export {};
