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

/** Type alias for heterogenous arrays, e.g. `HeterogenousArray<number | string>` instead of `(number | string)[]` */
export type HeterogenousArray<T> = T[];

/** Type alias for homogenous arrays, e.g. `HomogenousArray<number | string>` instead of `number[] | string[]` */
export type HomogenousArray<T> = T extends any ? T[] : never;

/**
 * Makes all properties in T mutable (removes readonly)
 * @template T - The type to make mutable
 * @example
 * ```typescript
 * interface User {
 *   readonly name: string;
 *   readonly age: number;
 * }
 *
 * type MutableUser = Mutable<User>;
 * // Result: { name: string; age: number; }
 * ```
 */
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

/**
 * Extracts the type of the first element in a tuple
 * @template T - The tuple type
 * @example
 * ```typescript
 * type FirstElement = First<[string, number, boolean]>; // string
 * ```
 */
export type First<T extends readonly unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

/**
 * Extracts the type of the last element in a tuple
 * @template T - The tuple type
 * @example
 * ```typescript
 * type LastElement = Last<[string, number, boolean]>; // boolean
 * ```
 */
export type Last<T extends readonly unknown[]> = T extends [...unknown[], infer L] ? L : never;

/**
 * Extracts all but the first element of a tuple
 * @template T - The tuple type
 * @example
 * ```typescript
 * type RestElements = Tail<[string, number, boolean]>; // [number, boolean]
 * ```
 */
export type Tail<T extends readonly unknown[]> = T extends [unknown, ...infer R] ? R : never;

/**
 * Extracts all but the last element of a tuple
 * @template T - The tuple type
 * @example
 * ```typescript
 * type HeadElements = Head<[string, number, boolean]>; // [string, number]
 * ```
 */
export type Head<T extends readonly unknown[]> = T extends [...infer H, unknown] ? H : never;

/**
 * Creates a tuple type with N elements of type T
 * @template T - The element type
 * @template N - The number of elements
 * @example
 * ```typescript
 * type StringTuple = Tuple<string, 3>; // [string, string, string]
 * type NumberTuple = Tuple<number, 2>; // [number, number]
 * ```
 */
export type Tuple<T, N extends number> = N extends N
	? number extends N
		? T[]
		: TupleOf<T, N, []>
	: never;
type TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
	? R
	: TupleOf<T, N, [...R, T]>;

/**
 * Creates a type that represents a value that might be undefined
 * @template T - The base type
 * @example
 * ```typescript
 * type MaybeString = Maybe<string>; // string | undefined
 * ```
 */
export type Maybe<T> = T | undefined;

/**
 * Creates a type that represents a value that might be null
 * @template T - The base type
 * @example
 * ```typescript
 * type NullableString = Nullable<string>; // string | null
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Creates a type that represents a value that might be null or undefined
 * @template T - The base type
 * @example
 * ```typescript
 * type OptionalString = Optional<string>; // string | null | undefined
 * ```
 */
export type Optional<T> = T | null | undefined;

/**
 * Removes null and undefined from a type
 * @template T - The type to filter
 * @example
 * ```typescript
 * type NonOptionalString = NonOptional<string | null | undefined>; // string
 * ```
 */
export type NonOptional<T> = T extends null | undefined ? never : T;

/** Creates a branded type for better type safety 
* @example
* // Without branding - these can be mixed accidentally
* type UserId = string;
* type ProductId = string;
* 
* function getUser(id: UserId) {}
* function getProduct(id: ProductId) {}
* 
* // These shouldn't work but TypeScript allows it
* getUser("product-123"); // Oops! Wrong type but no error
* getProduct("user-456"); // Oops! Wrong type but no error
* 
* // With branding - prevents mixing
* type UserId = Brand<string, 'UserId'>;
* type ProductId = Brand<string, 'ProductId'>;
* 
* function getUser(id: UserId) {}
* function getProduct(id: ProductId) {}

* // Now TypeScript prevents mixing
* getUser("product-123" as ProductId); // Error!
* getProduct("user-456" as UserId); // Error!
* 
* You need explicit casting to convert
* const userId: UserId = "user-123" as UserId;
* const productId: ProductId = "product-456" as ProductId; 
*/
export type Brand<T, B> = PrettifyIntersection<T & { readonly __brand: B }>;

/** Creates a type that ensures at least one property is present 
* @example
* const obj: AtLeastOne<{ a?: number, b?: string }> = { a: 1 };
* const obj2: AtLeastOne<{ a?: number, b?: string }> = { b: 'hello' };
* const obj3: AtLeastOne<{ a?: number, b?: string }> = { a: 1, b: 'hello' };
* const obj4: AtLeastOne<{ a?: number, b?: string }> = {}; // Error!
* @example
interface FormData {
  email?: string;
  phone?: string;
  address?: string;
}

// Without AtLeastOne - all properties can be undefined
const form: FormData = {}; // Valid but probably not what you want

// With AtLeastOne - at least one property must be present
type FormWithContact = AtLeastOne<FormData>;

const validForm: FormWithContact = { email: "user@example.com" }; // ✅
const validForm2: FormWithContact = { phone: "123-456-7890" }; // ✅
const validForm3: FormWithContact = { email: "user@example.com", phone: "123-456-7890" }; // ✅
const invalidForm: FormWithContact = {}; // ❌ Error: missing required property
*/
export type AtLeastOne<T> = PrettifyIntersection<
	{
		[K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
	}[keyof T]
>;

/** Creates a type that ensures exactly one property is present.  Helps to narrow optional properties to a single property.
* @example
interface PaymentMethod {
  creditCard?: { number: string; expiry: string };
  bankTransfer?: { accountNumber: string; routingNumber: string };
  paypal?: { email: string };
}

// Without ExactlyOne - multiple payment methods could be selected
const payment: PaymentMethod = {
  creditCard: { number: "1234", expiry: "12/25" },
  paypal: { email: "user@example.com" } // Shouldn't allow both!
};

// With ExactlyOne - only one payment method allowed
type SinglePaymentMethod = ExactlyOne<PaymentMethod>;

const validPayment: SinglePaymentMethod = { creditCard: { number: "1234", expiry: "12/25" } }; // ✅
const invalidPayment: SinglePaymentMethod = { 
  creditCard: { number: "1234", expiry: "12/25" },
  paypal: { email: "user@example.com" } // ❌ Error: multiple payment methods
};
*/
export type ExactlyOne<T> = PrettifyIntersection<
	{
		[K in keyof T]: Required<Pick<T, K>> & Partial<Record<Exclude<keyof T, K>, never>>;
	}[keyof T]
>;

/** Creates a deep partial type (recursively makes all properties optional) 
* @example
interface User {
  name: string;
  address: {
    street: string;
    city: string;
    country: {
      name: string;
      code: string;
    };
  };
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

// Regular Partial only makes top-level properties optional
type PartialUser = Partial<User>;
const partialUser: PartialUser = {
  name: "John",
  address: { street: "123 Main St", city: "NYC", country: { name: "USA", code: "US" } }
  // preferences is optional but if provided, all its properties are required
};

// DeepPartial makes all nested properties optional too
type DeepPartialUser = DeepPartial<User>;
const deepPartialUser: DeepPartialUser = {
  name: "John",
  address: { 
    street: "123 Main St",
    // city and country are optional
  },
  preferences: {
    theme: "dark",
    // notifications is optional
  }
};
*/
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Creates a deep readonly type (recursively makes all properties readonly)
* @example
interface Config {
	api: {
		baseUrl: string;
		timeout: number;
		headers: {
		authorization: string;
		contentType: string;
		};
	};
	features: {
		caching: boolean;
		logging: boolean;
	};
}

// Regular Readonly only makes top-level properties readonly
type ReadonlyConfig = Readonly<Config>;
const readonlyConfig: ReadonlyConfig = {
  api: { baseUrl: "https://api.example.com", timeout: 5000, headers: { authorization: "Bearer token", contentType: "application/json" } },
  features: { caching: true, logging: false }
};
// readonlyConfig.api = {}; // ❌ Error: readonly
// readonlyConfig.api.baseUrl = "new-url"; // ✅ This still works (not deeply readonly)

// DeepReadonly makes all nested properties readonly too
type DeepReadonlyConfig = DeepReadonly<Config>;
const deepReadonlyConfig: DeepReadonlyConfig = {
  api: { baseUrl: "https://api.example.com", timeout: 5000, headers: { authorization: "Bearer token", contentType: "application/json" } },
  features: { caching: true, logging: false }
};
// deepReadonlyConfig.api.baseUrl = "new-url"; // ❌ Error: deeply readonly
// deepReadonlyConfig.api.headers.authorization = "new-token"; // ❌ Error: deeply readonly
*/
export type DeepReadonly<T> = {
	readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
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
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns A new string with the first letter capitalized
 * @example
 * ```typescript
 * capitalize('hello'); // 'Hello'
 * capitalize('world'); // 'World'
 * capitalize(''); // ''
 * ```
 */
export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Splits a camel-cased string into an array of words
 * @param str - The camel-cased string to split
 * @returns An array of words from the camel-cased string
 * @example
 * ```typescript
 * split_camel_case('helloWorld'); // ['hello', 'World']
 * split_camel_case('camelCaseString'); // ['camel', 'Case', 'String']
 * split_camel_case('simple'); // ['simple']
 * ```
 */
export const split_camel_case = (str: string): string[] => {
	return str.split(/(?=[A-Z])/);
};

/**
 * Splits a snake-cased or kebab-cased string into an array of words
 * @param str - The string to split (snake_case or kebab-case)
 * @returns An array of words from the string
 * @example
 * ```typescript
 * split_snake_case('hello_world'); // ['hello', 'world']
 * split_snake_case('user-name'); // ['user', 'name']
 * split_snake_case('simple'); // ['simple']
 * ```
 */
export const split_snake_case = (str: string): string[] => {
	return str.indexOf('_') !== -1 ? str.split('_') : str.split('-');
};

/**
 * Removes all special characters from a string, keeping only letters, numbers, and spaces
 * @param str - The string to clean
 * @returns A string with special characters removed
 * @example
 * ```typescript
 * remove_special_characters('Hello, World!'); // 'Hello World'
 * remove_special_characters('user@example.com'); // 'userexamplecom'
 * remove_special_characters('file-name_123'); // 'filename 123'
 * ```
 */
export function remove_special_characters(str: string): string {
	return str.replace(/[^a-zA-Z0-9 ]/g, '');
}

/**
 * Converts kebab-case to Title Case with spaces
 * @param str - The kebab-cased string to convert
 * @returns A string with spaces and capitalized words
 * @example
 * ```typescript
 * dekebab('hello-world'); // 'Hello World'
 * dekebab('user-profile-settings'); // 'User Profile Settings'
 * dekebab('simple'); // 'Simple'
 * ```
 */
export function dekebab(str: string): string {
	return str
		.replace(/-/g, ' ')
		.split(' ')
		.map((s) => capitalize(s))
		.join(' ');
}

/**
 * Clamps a number between a minimum and maximum value
 * @param n - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped number
 * @example
 * ```typescript
 * clamp(5, 0, 10); // 5
 * clamp(-5, 0, 10); // 0
 * clamp(15, 0, 10); // 10
 * ```
 */
export function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

/**
 * Creates a delay for the specified number of milliseconds
 * @param time - The delay time in milliseconds
 * @returns A promise that resolves after the specified time
 * @example
 * ```typescript
 * await delay(1000); // Waits for 1 second
 * ```
 */
export async function delay(time: number) {
	await new Promise((args) => setTimeout(args, time));
}

/**
 * Generates a random number between a minimum and maximum value
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns A random number between min and max
 * @example
 * ```typescript
 * get_random_between(0, 1); // Random number between 0 and 1 (e.g., 0.7234)
 * get_random_between(1, 10); // Random number between 1 and 10 (e.g., 7.234)
 * get_random_between(-5, 5); // Random number between -5 and 5 (e.g., -2.1)
 * ```
 */
export function get_random_between(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between a minimum and maximum value (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 * @example
 * ```typescript
 * get_random_integer(1, 6); // Random integer between 1 and 6 (e.g., 4)
 * get_random_integer(0, 9); // Random integer between 0 and 9 (e.g., 7)
 * get_random_integer(-5, 5); // Random integer between -5 and 5 (e.g., -2)
 * ```
 */
export function get_random_integer(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Finds the maximum value in an array of numbers
 * Optimized for performance compared to Math.max() with spread operator
 * @param array - An array of numbers to search
 * @returns The maximum number in the array, or -Infinity if array is empty
 * @example
 * ```typescript
 * get_max([1, 5, 3, 9, 2]); // 9
 * get_max([-1, -5, -3]); // -1
 * get_max([]); // -Infinity
 * ```
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
 * Finds the minimum value in an array of numbers
 * Optimized for performance compared to Math.min() with spread operator
 * @param array - An array of numbers to search
 * @returns The minimum number in the array, or +Infinity if array is empty
 * @example
 * ```typescript
 * get_min([1, 5, 3, 9, 2]); // 1
 * get_min([-1, -5, -3]); // -5
 * get_min([]); // +Infinity
 * ```
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
 * Finds the earliest date in an array of dates
 * Optimized for performance compared to Math.min() with spread operator
 * @param array - An array of dates to search
 * @returns The earliest date in the array, or a far-future date if array is empty
 * @example
 * ```typescript
 * const dates = [
 *   new Date('2023-01-15'),
 *   new Date('2023-01-10'),
 *   new Date('2023-01-20')
 * ];
 * get_min_date(dates); // 2023-01-10
 * ```
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
 * Finds the earliest Temporal.ZonedDateTime in an array
 * Uses Temporal API for accurate timezone-aware comparisons
 * @param array - An array of Temporal.ZonedDateTime objects to search
 * @returns The earliest datetime in the array
 * @example
 * ```typescript
 * const datetimes = [
 *   Temporal.ZonedDateTime.from('2023-01-15T10:00:00Z[UTC]'),
 *   Temporal.ZonedDateTime.from('2023-01-15T08:00:00Z[UTC]'),
 *   Temporal.ZonedDateTime.from('2023-01-15T12:00:00Z[UTC]')
 * ];
 * get_min_temporal_zoned_date_time(datetimes); // 2023-01-15T08:00:00Z[UTC]
 * ```
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
 * Finds the latest Temporal.ZonedDateTime in an array
 * Uses Temporal API for accurate timezone-aware comparisons
 * @param array - An array of Temporal.ZonedDateTime objects to search
 * @returns The latest datetime in the array
 * @example
 * ```typescript
 * const datetimes = [
 *   Temporal.ZonedDateTime.from('2023-01-15T10:00:00Z[UTC]'),
 *   Temporal.ZonedDateTime.from('2023-01-15T08:00:00Z[UTC]'),
 *   Temporal.ZonedDateTime.from('2023-01-15T12:00:00Z[UTC]')
 * ];
 * get_max_temporal_zoned_date_time(datetimes); // 2023-01-15T12:00:00Z[UTC]
 * ```
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
 * Finds the latest date in an array of dates
 * Optimized for performance compared to Math.max() with spread operator
 * @param array - An array of dates to search
 * @returns The latest date in the array, or a far-past date if array is empty
 * @example
 * ```typescript
 * const dates = [
 *   new Date('2023-01-15'),
 *   new Date('2023-01-10'),
 *   new Date('2023-01-20')
 * ];
 * get_max_date(dates); // 2023-01-20
 * ```
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

/**
 * Flattens a nested object structure into a single-level object with dot-notation keys
 * @param obj - The nested object to flatten
 * @returns A flattened object with dot-notation keys
 * @example
 * ```typescript
 * const nested = {
 *   user: {
 *     name: 'John',
 *     address: {
 *       city: 'NYC',
 *       country: 'USA'
 *     }
 *   },
 *   settings: {
 *     theme: 'dark'
 *   }
 * };
 *
 * flatten_object_recursively(nested);
 * // Result: {
 * //   'user.name': 'John',
 * //   'user.address.city': 'NYC',
 * //   'user.address.country': 'USA',
 * //   'settings.theme': 'dark'
 * // }
 * ```
 */
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
/**
 * Returns an array of all ancestor elements for the provided HTML element
 * @param element - The HTML element to find ancestors for
 * @returns An array of ancestor elements, starting from the immediate parent
 * @example
 * ```typescript
 * const button = document.querySelector('button');
 * const ancestors = get_ancestors(button);
 * // Returns: [parent, grandparent, great-grandparent, ...]
 * ```
 */
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
/**
 * Extracts transition durations from an array of HTML elements
 * @param elements - Array of HTML elements to check for transition durations
 * @returns Array of transition durations in seconds
 * @example
 * ```typescript
 * const elements = document.querySelectorAll('.animated');
 * const durations = get_transition_durations(Array.from(elements));
 * // Returns: [0.3, 0.5, 0.2] (in seconds)
 * ```
 */
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

/**
 * Performs true modulo operation (handles negative numbers correctly)
 * Unlike JavaScript's % operator which is remainder, this gives true modulo
 * @param dividend - The number to divide
 * @param divisor - The number to divide by
 * @returns The true modulo result
 * @example
 * ```typescript
 * modulo(7, 3); // 1
 * modulo(-7, 3); // 2 (not -1 like with %)
 * modulo(7, -3); // -2
 * ```
 */
export function modulo(dividend: number, divisor: number): number {
	// handle negative numbers to behave like a true modulo operation instead of a remainder operation
	return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Makes all non-static properties enumerable for Svelte 5 runed objects
 * This allows access to runed properties by index lookups (e.g. `obj[key]`)
 * @param this_obj - The object to make properties enumerable
 * @example
 * ```typescript
 * class MyComponent {
 *   constructor() {
 *     enumerate_runed_properties(this);
 *   }
 * }
 * ```
 */
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
/**
 * Merges two types, giving precedence to the properties of B
 * @template A - The first type
 * @template B - The second type (takes precedence on conflicts)
 * @example
 * ```typescript
 * interface User { name: string; age: number; role: string; }
 * interface Admin { role: 'admin'; permissions: string[]; }
 *
 * type UserAdmin = Merge<User, Admin>;
 * // Result: { name: string; age: number; role: 'admin'; permissions: string[]; }
 * // Note: role is narrowed from string to 'admin' (from Admin)
 *
 * interface BaseConfig { timeout: number; retries: number; }
 * interface ApiConfig { timeout: 5000; baseUrl: string; }
 *
 * type Config = Merge<BaseConfig, ApiConfig>;
 * // Result: { timeout: 5000; retries: number; baseUrl: string; }
 * // Note: timeout is narrowed from number to 5000
 * ```
 */
export type Merge<A, B> = PrettifyIntersection<Omit<A, keyof B> & B>;

/**
 * Gets the union of all property values of a type
 * @template T - The object type
 * @example
 * ```typescript
 * interface Config { theme: 'light' | 'dark'; size: 'small' | 'large'; }
 * type ConfigValues = ValueOf<Config>; // 'light' | 'dark' | 'small' | 'large'
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts the keys of an object type that have a specific value type
 * @template T - The object type
 * @template V - The value type to match
 * @example
 * ```typescript
 * interface User { name: string; age: number; email: string; }
 * type StringKeys = KeysOfType<User, string>; // 'name' | 'email'
 * type NumberKeys = KeysOfType<User, number>; // 'age'
 * ```
 */
export type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

/**
 * Converts a type to a required type, recursively making all properties required
 * @template T - The type to make required
 * @example
 * ```typescript
 * interface User { name?: string; address?: { street?: string; city?: string; }; }
 * type RequiredUser = DeepRequired<User>;
 * // Result: { name: string; address: { street: string; city: string; }; }
 * ```
 */
export type DeepRequired<T> = { [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K] };

/**
 * Type guard to check if a value is a plain object (not null, not an array)
 * @param val - The value to check
 * @returns True if the value is a plain object, false otherwise
 * @example
 * ```typescript
 * is_object({}); // true
 * is_object([]); // false
 * is_object(null); // false
 * is_object("string"); // false
 * ```
 */
export function is_object(val: unknown): val is Record<PropertyKey, unknown> {
	return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Groups array elements by a key function, similar to SQL `GROUP BY`.
 * Note: This is a custom implementation. Consider using Object.groupBy() (ES2024) for better performance
 * @param arr - The array to group
 * @param key - Function that extracts the grouping key from each element
 * @returns An object where keys are the grouping values and values are arrays of elements
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', age: 25, city: 'NYC' },
 *   { name: 'Bob', age: 30, city: 'LA' },
 *   { name: 'Charlie', age: 25, city: 'NYC' }
 * ];
 *
 * const groupedByAge = group_by(users, user => user.age);
 * // Result: { 25: [{ name: 'Alice', age: 25, city: 'NYC' }, { name: 'Charlie', age: 25, city: 'NYC' }], 30: [{ name: 'Bob', age: 30, city: 'LA' }] }
 *
 * const groupedByCity = group_by(users, user => user.city);
 * // Result: { 'NYC': [...], 'LA': [...] }
 *
 * // Alternative using native Object.groupBy() (ES2024)
 * const groupedByAgeNative = Object.groupBy(users, user => user.age);
 * ```
 */
export function group_by<T, K extends string | number | symbol>(
	arr: T[],
	key: (item: T) => K
): Record<K, T[]> {
	return arr.reduce(
		(acc, item) => {
			const group = key(item);
			(acc[group] ||= []).push(item);
			return acc;
		},
		{} as Record<K, T[]>
	);
}

/**
 * Removes duplicate elements from an array based on a key function
 * @param arr - The array to deduplicate
 * @param key - Function that extracts the key used for deduplication
 * @returns A new array with duplicates removed (keeps first occurrence)
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' } // duplicate
 * ];
 *
 * const uniqueUsers = uniqueBy(users, user => user.id);
 * // Result: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * const uniqueNames = uniqueBy(users, user => user.name);
 * // Result: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 */
export function uniqueBy<T, K>(arr: T[], key: (item: T) => K): T[] {
	const seen = new Set<K>();
	return arr.filter((item) => {
		const k = key(item);
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}
