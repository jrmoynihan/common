import { ErrorLog } from './logging.js';

/**
 * Capitalize the first letter of a string
 * @param str the string to capitalize
 * @returns a capitalized string
 */
export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
/**
 * Split a camel-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export const splitCamelCase = (str: string): string[] => {
	return str.split(/(?=[A-Z])/);
};
/**
 * Split a snake-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export const splitSnakeCase = (str: string): string[] => {
	return str.indexOf('_') !== -1 ? str.split('_') : str.split('-');
};
/**
 * Removes special characters from a string
 * @param str the string to remove special characters from
 * @returns a string with the special characters replaced by ''
 */
export function removeSpecialCharacters(str: string): string {
	return str.replace(/[^a-zA-Z0-9 ]/g, '');
}
/** Replaces kebab case (e.g. "hello-world") with a space between words and capitalized words ("Hello World") */
export function deKebab(str: string): string {
	return str
		.replace(/-/g, ' ')
		.split(' ')
		.map((s) => capitalize(s))
		.join(' ');
}

// A function to make an array of length equal to the provided number
export function arrayFromNumber(n: number, map_function?: (a: any, i: number) => any) {
	if (!map_function) map_function = (_: any, i?: number) => i;
	return Array(n).fill(0).map(map_function);
}
// A function to clamp a number between two numbers
export function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}
export async function delay(time: number) {
	await new Promise((args) => setTimeout(args, time));
}
/**
 * Provides a random number between a minimum and maximum number
 * @param min The minimum number to return
 * @param max The maximum number to return
 * @returns a random number between `min` and `max`
 */
export function getRandomBetween(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
/**
 * A faster way to find the max of an array of numbers than `Math.max()`
 * @param array An array of numbers to search
 * @returns The maximum number in the array
 */
export const getMax = (array: number[]): number => {
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
export const getMin = (array: any[]): number => {
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
export const getMinDate = (array: Date[]): Date => {
	let len = array.length;
	let min = new Date(8640000000000000);

	while (len--) {
		min = array[len].getTime() < min.getTime() ? array[len] : min;
	}
	return min;
};
/**
 * A faster way to find the max of an array of dates
 * @param array An array of dates to search
 * @returns The maximum date in the array
 */
export const getMaxDate = (array: Date[]): Date => {
	let len = array.length;
	let max = new Date(-8640000000000000);

	while (len--) {
		max = array[len].getTime() > max.getTime() ? array[len] : max;
	}
	return max;
};

/** Take an object and return its entire structure flattened to the top-level of a new object's keys. */
export const flattenObjectRecursively = (obj: Object & { [key: string]: unknown }) => {
	try {
		// The object which contains the final result
		let result: { [key: string]: unknown } = {};
		// loop through the object "ob"
		if (obj && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date)) {
			for (const [key, value] of Object.entries(obj)) {
				// We check the type of the i using typeof() function and recursively call the function again
				if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
					const val_typed = value as Object & { [key: string]: unknown };

					const temp = flattenObjectRecursively(val_typed) as Object & { [key: string]: unknown };
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
	} catch (error) {
		if (error instanceof Error) ErrorLog({ msg: 'error in flattening object recursively', error });
	}
};
/** Returns an array of the ancestor elements for the provided HTML element. */
export const getAncestors = (element: HTMLElement) => {
	let ancestors: HTMLElement[] = [];
	let parent = element.parentElement;
	try {
		while (parent) {
			ancestors.unshift(parent);
			if (parent.parentElement) {
				parent = parent.parentElement;
			} else {
				return ancestors;
			}
		}
		return ancestors;
	} catch (error) {
		if (error instanceof Error)
			ErrorLog({ error, msg: 'Encountered an error getting element ancestors.' });
	}
};
export function getTransitionDurations(elements: HTMLElement[]): number[] {
	const durations: number[] = [];
	elements.forEach((ele) => {
		const computed_style = window.getComputedStyle(ele);
		const duration = computed_style.transitionDuration;
		if (duration) {
			durations.push(parseFloat(duration.replace('s', '')) as number);
		}
	});
	return durations;
}
export function modulo(dividend: number, divisor: number): number {
	// handle negative numbers to behave like a true modulo operation instead of a remainder operation
	return ((dividend % divisor) + divisor) % divisor;
}
