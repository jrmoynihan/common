import { Temporal } from '@js-temporal/polyfill';
import { ErrorLog } from './logging.js';

/** Helps give better tooltips to intersection types
* 
@example
```
const obj_a : { a: number} = { a: 0 }
const obj_b : { b: string } = { b: 'hello' }
const obj_c : PrettifyIntersection<typeof obj_a & typeof obj_b> = { a: 1, b : 'World'}
// typeof obj_c is now inferred as `{ a: number, b: string }`, instead of the less readable `{ a: number } & { b: string }`
```

https://twitter.com/mattpocockuk/status/1622730173446557697
*/
export type PrettifyIntersection<T> = { [K in keyof T]: T[K] } & {};

/** From `T`, makes all properties within union `K` optional
* 
@example
```
const obj_a : { a: number, b: string} = { a: 0, b: 'one' }
const obj_b : PartiallyOptional<typeof obj_a, 'a'> = { b : 'World'}
// typeof obj_b is now inferred as `{ a?: number | undefined, b: string }`
```
*/
export type PartiallyOptional<T, K extends keyof T> = PrettifyIntersection<
	Pick<Partial<T>, K> & Omit<T, K>
>;

/** From `T`, makes all properties within union `K` required, but all others optional
* 
@example
```
const obj_a : { a: number, b: string } = { a: 0, b: 'one' }
const obj_b : PartiallyRequired<typeof obj_a, 'a'> = { a: 1 }
// typeof obj_b is now inferred as `{ a: number, b?: string | undefined }`
```
*/
export type PartiallyRequired<T, K extends keyof T> = PrettifyIntersection<
	Pick<T, K> & Partial<Omit<T, K>>
>;

const obj_a: { a: number } = { a: 0 };
const obj_b: { b: string } = { b: 'hello' };
const intersected: PrettifyIntersection<typeof obj_a & typeof obj_b> = { a: 1, b: 'World' };
const partially_required: PartiallyRequired<typeof intersected, 'a'> = {
	a: 1
};
const not_required_from_parent: PartiallyOptional<typeof intersected, 'a'> = {
	b: 'one'
};
const totally_optional: { a?: number; b?: string } = {};
const required_by_union: PartiallyRequired<typeof totally_optional & { a: number }, 'a'> = { a: 0 };

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
	let max = Number.NEGATIVE_INFINITY;

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
export const getMin = (array: number[]): number => {
	let len = array.length;
	let min = Number.POSITIVE_INFINITY;

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
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export const getMinTemporalZonedDateTime = (
	array: Temporal.ZonedDateTime[]
): Temporal.ZonedDateTime => {
	let len = array.length;
	const max_date = new Date(8640000000000000);
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
export const getMaxTemporalZonedDateTime = (
	array: Temporal.ZonedDateTime[]
): Temporal.ZonedDateTime => {
	let len = array.length;
	const min_date = new Date(-8640000000000000);
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
export const getMaxDate = (array: Date[]): Date => {
	let len = array.length;
	let max = new Date(-8640000000000000);

	while (len--) {
		max = array[len].getTime() > max.getTime() ? array[len] : max;
	}
	return max;
};

/** Take an object and return its entire structure flattened to the top-level of a new object's keys. */
export const flattenObjectRecursively = (
	obj: { [key: string]: unknown } & { [key: string]: unknown }
) => {
	try {
		// The object which contains the final result
		const result: { [key: string]: unknown } = {};
		// loop through the object "ob"
		if (obj && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date)) {
			for (const [key, value] of Object.entries(obj)) {
				// We check the type of the i using typeof() function and recursively call the function again
				if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
					const val_typed = value as { [key: string]: unknown };

					const temp = flattenObjectRecursively(val_typed) as {
						[key: string]: unknown;
					};
					for (const [key2, val2] of Object.entries(temp)) {
						// Store temp in result
						result[`${key}.${key2}`] = val2;
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
	const ancestors: HTMLElement[] = [];
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
			ErrorLog({
				error,
				msg: 'Encountered an error getting element ancestors.'
			});
	}
};
export function getTransitionDurations(elements: HTMLElement[]): number[] {
	const durations: number[] = [];
	for (const ele of elements) {
		const computed_style = window.getComputedStyle(ele);
		const duration = computed_style.transitionDuration;
		if (duration) {
			durations.push(Number.parseFloat(duration.replace('s', '')) as number);
		}
	}
	return durations;
}
export function modulo(dividend: number, divisor: number): number {
	// handle negative numbers to behave like a true modulo operation instead of a remainder operation
	return ((dividend % divisor) + divisor) % divisor;
}

export function createMediaQuery(query: string) {
	let match = $state<boolean | null>(null);

	$effect.pre(() => {
		const mediaQueryList = window.matchMedia(query);

		const updateMatch = (queryList: MediaQueryList | MediaQueryListEvent) => {
			match = queryList.matches;
		};

		updateMatch(mediaQueryList);

		mediaQueryList.addEventListener('change', updateMatch);

		return () => {
			mediaQueryList.removeEventListener('change', updateMatch);
		};
	});

	return {
		get match() {
			return match;
		}
	};
}
/** Add this to a class constructor to make all non-static properties enumerable.  Allows access to runed properties by index lookups (e.g. `obj[key]`). */
export function enumerate_runed_properties(this_obj: Object) {
	const prototype = Object.getPrototypeOf(this_obj);
	const prototype_property_descriptors = Object.getOwnPropertyDescriptors(prototype);
	for (const [property, descriptor] of Object.entries(prototype_property_descriptors)) {
		const is_nonstatic_getter = typeof descriptor.get === 'function';
		if (is_nonstatic_getter) {
			descriptor.enumerable = true;
			Object.defineProperty(this_obj, property, descriptor);
		}
	}
}
