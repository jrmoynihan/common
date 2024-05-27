import { getContext, setContext } from 'svelte';
import {
	derived,
	readable,
	writable,
	type Readable,
	type StartStopNotifier,
	type Unsubscriber,
	type Writable
} from 'svelte/store';

/** One or more `Readable`s. */
declare type Stores =
	| Readable<any>
	| [Readable<any>, ...Array<Readable<any>>]
	| Array<Readable<any>>;
/** One or more values from `Readable` stores. */
declare type StoresValues<T> =
	T extends Readable<infer U>
		? U
		: {
				[K in keyof T]: T[K] extends Readable<infer U> ? U : never;
			};

export function setWritableStoreContext<T>(
	key: string,
	value: T,
	start?: StartStopNotifier<T>
): Writable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, writable<T>(value, start));
}
export function getWritableStoreContext<T>(key: string): Writable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Writable<T>>(unique_key);
}
export function setReadableStoreContext<T>(
	key: string,
	value: T,
	start?: StartStopNotifier<T>
): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, readable<T>(value, start));
}
export function getReadableStoreContext<T>(key: string): Readable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Readable<T>>(unique_key);
}
export function setDerivedStoreContext<S, T>(
	key: string,
	stores: S extends Stores ? any : any,
	callback: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
	initial_value?: T
): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, derived(stores, callback, initial_value));
}
export function getDerivedStoreContext<T>(key: string): Readable<T> {
	return getReadableStoreContext(key);
}
export function asyncGet<T>(store: Readable<T>) {
	return new Promise<T>((resolve) => {
		store.subscribe((value) => {
			resolve(value);
		});
	});
}
/**
 * Sets a derived context value for the given key. 
The expression provided should be free of side-effects.
Internally, this will assign a unique {@link Symbol} for the key, avoiding key collision.
 *
 * @param {string} key - The key for the derived context value.
 * @param {T} expression - The expression to derive the context value from.
 * @return {T} - This function returns the derived context value.

 * Example:
 * ```ts
 * let double = setDerivedContext('double', count * 2);
 * ```
 * https://svelte.dev/docs/svelte#setcontext
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$derived
 */
export function setDerivedContext<T>(key: string, expression: T) {
	const _unique_key = Symbol.for(key);
	const _expression = $derived(expression);
	return setContext(_unique_key, _expression);
}
