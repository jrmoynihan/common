import { Temporal } from '@js-temporal/polyfill';
/**
 * Capitalize the first letter of a string
 * @param str the string to capitalize
 * @returns a capitalized string
 */
export declare const capitalize: (str: string) => string;
/**
 * Split a camel-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export declare const splitCamelCase: (str: string) => string[];
/**
 * Split a snake-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export declare const splitSnakeCase: (str: string) => string[];
/**
 * Removes special characters from a string
 * @param str the string to remove special characters from
 * @returns a string with the special characters replaced by ''
 */
export declare function removeSpecialCharacters(str: string): string;
/** Replaces kebab case (e.g. "hello-world") with a space between words and capitalized words ("Hello World") */
export declare function deKebab(str: string): string;
export declare function arrayFromNumber(n: number, map_function?: (a: any, i: number) => any): any[];
export declare function clamp(n: number, min: number, max: number): number;
export declare function delay(time: number): Promise<void>;
/**
 * Provides a random number between a minimum and maximum number
 * @param min The minimum number to return
 * @param max The maximum number to return
 * @returns a random number between `min` and `max`
 */
export declare function getRandomBetween(min: number, max: number): number;
/**
 * A faster way to find the max of an array of numbers than `Math.max()`
 * @param array An array of numbers to search
 * @returns The maximum number in the array
 */
export declare const getMax: (array: number[]) => number;
/**
 * A faster way to find the min of an array of numbers than `Math.min()`
 * @param array An array of numbers to search
 * @returns The minimum number in the array
 */
export declare const getMin: (array: any[]) => number;
/**
 * A faster way to find the min of an array of dates
 * @param array An array of dates to search
 * @returns The minimum date in the array
 */
export declare const getMinDate: (array: Date[]) => Date;
/**
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export declare const getMinTemporalZonedDateTime: (array: Temporal.ZonedDateTime[]) => Temporal.ZonedDateTime;
/**
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export declare const getMaxTemporalZonedDateTime: (array: Temporal.ZonedDateTime[]) => Temporal.ZonedDateTime;
/**
 * A faster way to find the max of an array of dates
 * @param array An array of dates to search
 * @returns The maximum date in the array
 */
export declare const getMaxDate: (array: Date[]) => Date;
/** Take an object and return its entire structure flattened to the top-level of a new object's keys. */
export declare const flattenObjectRecursively: (obj: Object & {
    [key: string]: unknown;
}) => {
    [key: string]: unknown;
} | undefined;
/** Returns an array of the ancestor elements for the provided HTML element. */
export declare const getAncestors: (element: HTMLElement) => HTMLElement[] | undefined;
export declare function getTransitionDurations(elements: HTMLElement[]): number[];
export declare function modulo(dividend: number, divisor: number): number;
