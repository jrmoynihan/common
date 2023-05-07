import { Temporal } from '@js-temporal/polyfill';
import { ErrorLog } from './logging.js';
/**
 * Capitalize the first letter of a string
 * @param str the string to capitalize
 * @returns a capitalized string
 */
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
/**
 * Split a camel-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export const splitCamelCase = (str) => {
    return str.split(/(?=[A-Z])/);
};
/**
 * Split a snake-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export const splitSnakeCase = (str) => {
    return str.indexOf('_') !== -1 ? str.split('_') : str.split('-');
};
/**
 * Removes special characters from a string
 * @param str the string to remove special characters from
 * @returns a string with the special characters replaced by ''
 */
export function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
}
/** Replaces kebab case (e.g. "hello-world") with a space between words and capitalized words ("Hello World") */
export function deKebab(str) {
    return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((s) => capitalize(s))
        .join(' ');
}
// A function to make an array of length equal to the provided number
export function arrayFromNumber(n, map_function) {
    if (!map_function)
        map_function = (_, i) => i;
    return Array(n).fill(0).map(map_function);
}
// A function to clamp a number between two numbers
export function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
export async function delay(time) {
    await new Promise((args) => setTimeout(args, time));
}
/**
 * Provides a random number between a minimum and maximum number
 * @param min The minimum number to return
 * @param max The maximum number to return
 * @returns a random number between `min` and `max`
 */
export function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * A faster way to find the max of an array of numbers than `Math.max()`
 * @param array An array of numbers to search
 * @returns The maximum number in the array
 */
export const getMax = (array) => {
    let len = array.length;
    let max = -Infinity;
    while (len--) {
        max = array[len] > max ? array[len] : max;
    }
    return max;
};
/**
 * A faster way to find the min of an array of numbers than `Math.min()`
 * @param array An array of numbers to search
 * @returns The minimum number in the array
 */
export const getMin = (array) => {
    let len = array.length;
    let min = Infinity;
    while (len--) {
        min = array[len] < min ? array[len] : min;
    }
    return min;
};
/**
 * A faster way to find the min of an array of dates
 * @param array An array of dates to search
 * @returns The minimum date in the array
 */
export const getMinDate = (array) => {
    let len = array.length;
    let min = new Date(8640000000000000);
    while (len--) {
        min = array[len].getTime() < min.getTime() ? array[len] : min;
    }
    return min;
};
/**
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export const getMinTemporalZonedDateTime = (array) => {
    let len = array.length;
    let max_date = new Date(8640000000000000);
    let min = Temporal.ZonedDateTime.from(max_date.toLocaleDateString());
    while (len--) {
        // https://tc39.es/proposal-temporal/docs/zoneddatetime.html#compare
        // Returns: an integer indicating whether one comes before or after or is equal to two.
        // −1 if one is less than two
        // Zero if the two instances describe the same exact instant, ignoring the time zone and calendar
        // 1 if one is greater than two
        const compared = Temporal.ZonedDateTime.compare(min, array[len]);
        min = compared === -1 ? array[len] : min;
    }
    return min;
};
/**
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export const getMaxTemporalZonedDateTime = (array) => {
    let len = array.length;
    let min_date = new Date(-8640000000000000);
    let max = Temporal.ZonedDateTime.from(min_date.toLocaleDateString());
    while (len--) {
        // https://tc39.es/proposal-temporal/docs/zoneddatetime.html#compare
        // Returns: an integer indicating whether one comes before or after or is equal to two.
        // −1 if one is less than two
        // Zero if the two instances describe the same exact instant, ignoring the time zone and calendar
        // 1 if one is greater than two
        const compared = Temporal.ZonedDateTime.compare(max, array[len]);
        max = compared === 1 ? array[len] : max;
    }
    return max;
};
/**
 * A faster way to find the max of an array of dates
 * @param array An array of dates to search
 * @returns The maximum date in the array
 */
export const getMaxDate = (array) => {
    let len = array.length;
    let max = new Date(-8640000000000000);
    while (len--) {
        max = array[len].getTime() > max.getTime() ? array[len] : max;
    }
    return max;
};
/** Take an object and return its entire structure flattened to the top-level of a new object's keys. */
export const flattenObjectRecursively = (obj) => {
    try {
        // The object which contains the final result
        let result = {};
        // loop through the object "ob"
        if (obj && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date)) {
            for (const [key, value] of Object.entries(obj)) {
                // We check the type of the i using typeof() function and recursively call the function again
                if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                    const val_typed = value;
                    const temp = flattenObjectRecursively(val_typed);
                    for (const [key2, val2] of Object.entries(temp)) {
                        // Store temp in result
                        result[key + '.' + key2] = val2;
                    }
                }
                // Else store ob[i] in result directly
                else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }
    catch (error) {
        if (error instanceof Error)
            ErrorLog({ msg: 'error in flattening object recursively', error });
    }
};
/** Returns an array of the ancestor elements for the provided HTML element. */
export const getAncestors = (element) => {
    let ancestors = [];
    let parent = element.parentElement;
    try {
        while (parent) {
            ancestors.unshift(parent);
            if (parent.parentElement) {
                parent = parent.parentElement;
            }
            else {
                return ancestors;
            }
        }
        return ancestors;
    }
    catch (error) {
        if (error instanceof Error)
            ErrorLog({ error, msg: 'Encountered an error getting element ancestors.' });
    }
};
export function getTransitionDurations(elements) {
    const durations = [];
    elements.forEach((ele) => {
        const computed_style = window.getComputedStyle(ele);
        const duration = computed_style.transitionDuration;
        if (duration) {
            durations.push(parseFloat(duration.replace('s', '')));
        }
    });
    return durations;
}
export function modulo(dividend, divisor) {
    // handle negative numbers to behave like a true modulo operation instead of a remainder operation
    return ((dividend % divisor) + divisor) % divisor;
}
