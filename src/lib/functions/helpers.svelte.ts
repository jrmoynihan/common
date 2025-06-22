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
	Required<Pick<T, K>> & Partial<Omit<T, K>>
>;

/** From `T`, makes all properties optional, and applies NonNullable to their value types. */
export type PartialWithNonNullableValues<T> = {
	[P in keyof T]?: NonNullable<T[P]>;
};

/** Makes all values within `T` non-nullable. */
export type NonNullableValues<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

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
export const split_camel_case = (str: string): string[] => {
	return str.split(/(?=[A-Z])/);
};
/**
 * Split a snake-cased string into an array of words
 * @param str the string to split
 * @returns an array of strings
 */
export const split_snake_case = (str: string): string[] => {
	return str.indexOf('_') !== -1 ? str.split('_') : str.split('-');
};
/**
 * Removes special characters from a string
 * @param str the string to remove special characters from
 * @returns a string with the special characters replaced by ''
 */
export function remove_special_characters(str: string): string {
	return str.replace(/[^a-zA-Z0-9 ]/g, '');
}
/** Replaces kebab case (e.g. "hello-world") with a space between words and capitalized words ("Hello World") */
export function dekebab(str: string): string {
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
export function get_random_between(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
/**
 * A faster way to find the max of an array of numbers than `Math.max()`
 * @param array An array of numbers to search
 * @returns The maximum number in the array
 */
export const get_max = (array: number[]): number => {
	let len = array.length;
	let max = Number.NEGATIVE_INFINITY;

	while (len--) {
		// @ts-ignore
		max = array[len] > max ? array[len] : max;
	}
	return max;
};
/**
 * A faster way to find the min of an array of numbers than `Math.min()`
 * @param array An array of numbers to search
 * @returns The minimum number in the array
 */
export const get_min = (array: number[]): number => {
	let len = array.length;
	let min = Number.POSITIVE_INFINITY;

	while (len--) {
		// @ts-ignore
		min = array[len] < min ? array[len] : min;
	}
	return min;
};
/**
 * A faster way to find the min of an array of dates
 * @param array An array of dates to search
 * @returns The minimum date in the array
 */
export const get_min_date = (array: Date[]): Date => {
	let len = array.length;
	let min = new Date(8640000000000000);

	while (len--) {
		// @ts-ignore
		min = array[len].getTime() < min.getTime() ? array[len] : min;
	}
	return min;
};
/**
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export const get_min_temporal_zoned_date_time = (
	array: Temporal.ZonedDateTime[]
): Temporal.ZonedDateTime => {
	let len = array.length;
	const max_date = new Date(8640000000000000);
	let min = Temporal.ZonedDateTime.from(max_date.toLocaleDateString());
	while (len--) {
		// @ts-ignore
		// https://tc39.es/proposal-temporal/docs/zoneddatetime.html#compare
		// Returns: an integer indicating whether one comes before or after or is equal to two.
		// −1 if one is less than two
		// Zero if the two instances describe the same exact instant, ignoring the time zone and calendar
		// 1 if one is greater than two
		const compared = Temporal.ZonedDateTime.compare(min, array[len]);
		// @ts-ignore
		min = compared === -1 ? array[len] : min;
	}
	return min;
};
/**
 * A faster way to find the min of an array of Temporal.ZonedDateTime items
 * @param array An array of datetimes to search
 * @returns The minimum datetime in the array
 */
export const get_max_temporal_zoned_date_time = (
	array: Temporal.ZonedDateTime[]
): Temporal.ZonedDateTime => {
	let len = array.length;
	const min_date = new Date(-8640000000000000);
	let max = Temporal.ZonedDateTime.from(min_date.toLocaleDateString());
	while (len--) {
		// @ts-ignore
		// https://tc39.es/proposal-temporal/docs/zoneddatetime.html#compare
		// Returns: an integer indicating whether one comes before or after or is equal to two.
		// −1 if one is less than two
		// Zero if the two instances describe the same exact instant, ignoring the time zone and calendar
		// 1 if one is greater than two
		const compared = Temporal.ZonedDateTime.compare(max, array[len]);
		// @ts-ignore
		max = compared === 1 ? array[len] : max;
	}
	return max;
};
/**
 * A faster way to find the max of an array of dates
 * @param array An array of dates to search
 * @returns The maximum date in the array
 */
export const get_max_date = (array: Date[]): Date => {
	let len = array.length;
	let max = new Date(-8640000000000000);

	while (len--) {
		// @ts-ignore
		max = array[len].getTime() > max.getTime() ? array[len] : max;
	}
	return max;
};

/** Take an object and return its entire structure flattened to the top-level of a new object's keys. */
export const flatten_object_recursively = (
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

					const temp = flatten_object_recursively(val_typed) as {
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
export const get_ancestors = (element: HTMLElement) => {
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
export function get_transition_durations(elements: HTMLElement[]): number[] {
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

export function create_media_query(query: string) {
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

/**
 * Calculates the length of a string type.
 *
 * @template T - The string type whose length is to be calculated.
 * @template Count - An array used to count the characters in the string.
 * @returns The length of the string as a number.
 */
export type StringLength<
	T extends string,
	Count extends number[] = []
> = T extends `${infer _}${infer Rest}` ? StringLength<Rest, [...Count, 1]> : Count['length'];

/**
 * Compares two number types and determines their relationship.
 *
 * @template First - The first number to compare.
 * @template Second - The second number to compare.
 * @template Count - An array used to count the iterations during comparison.
 * @returns 'equal' if both numbers are the same, 'less' if the first is less than the second,
 *          and 'greater' if the first is greater than the second.
 */
export type CompareNumbers<
	First extends number,
	Second extends number,
	Count extends number[] = []
> = First extends Second
	? 'equal'
	: Count['length'] extends First
		? 'less'
		: Count['length'] extends Second
			? 'greater'
			: CompareNumbers<First, Second, [...Count, 0]>;

/**
 * Ensures that a string type does not exceed a specified maximum length.
 *
 * @template T - The string type to check.
 * @template Max - The maximum length allowed for the string.
 * @returns The string type if its length is less than or equal to Max, otherwise never.
 */
export type MaxLength<T extends string, Max extends number> =
	CompareNumbers<StringLength<T>, Max> extends 'less' | 'equal' ? T : never;

/**
 * Ensures that a string type meets a specified minimum length.
 *
 * @template T - The string type to check.
 * @template Min - The minimum length required for the string.
 * @returns The string type if its length is greater than or equal to Min, otherwise never.
 */
export type MinLength<T extends string, Min extends number> =
	CompareNumbers<Min, StringLength<T>> extends 'less' | 'equal' ? T : never;

/**
 * Ensures that a string type's length is between a specified minimum and maximum.
 *
 * @template T - The string type to check.
 * @template Min number - The minimum length required for the string.
 * @template Max - The maximum length allowed for the string.
 * @returns The string type if its length is between Min and Max, otherwise never.
 */
export type StringLengthBetween<
	T extends string,
	Min extends number,
	Max extends number
> = MinLength<T, Min> & MaxLength<T, Max>;

export const align_content_options = {
	normal: 'normal',
	start: 'start',
	end: 'end',
	center: 'center',
	stretch: 'stretch',
	baseline: 'baseline',
	'space-between': 'space-between',
	'space-around': 'space-around',
	'space-evenly': 'space-evenly'
};
export const align_items_options = {
	normal: 'normal',
	start: 'start',
	end: 'end',
	center: 'center',
	stretch: 'stretch',
	baseline: 'baseline',
	'anchor-center': 'anchor-center'
};
export const align_self_options = {
	...align_items_options,
	auto: 'auto'
};
export const justify_self_options = {
	...align_self_options
};
export const justify_content_options = {
	...align_content_options
};
export const justify_items_options = {
	...align_items_options
};
export const wrap_options = {
	wrap: 'wrap',
	nowrap: 'nowrap',
	'wrap-reverse': 'wrap-reverse'
};
export const direction_options = {
	row: 'row',
	column: 'column'
};
export const overflow_options = {
	hidden: 'hidden',
	scroll: 'scroll',
	auto: 'auto',
	visible: 'visible'
};
export const grid_fit_options = {
	'auto-fit': 'auto-fit',
	'auto-fill': 'auto-fill'
};
