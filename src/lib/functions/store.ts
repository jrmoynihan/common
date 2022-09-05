import { getContext, setContext } from 'svelte';
import {
	derived,
	readable,
	writable,
	type Readable,
	type Writable,
	type Stores,
	type StoresValues,
	get,
	type StartStopNotifier,
	type Unsubscriber
} from 'svelte/store';

export function setWritableContext<T>(
	key: string,
	value: T,
	start?: StartStopNotifier<T>
): Writable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, writable<T>(value, start));
}
export function getWritableContext<T>(key: string): Writable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Writable<T>>(unique_key);
}
export function setReadableContext<T>(
	key: string,
	value: T,
	start?: StartStopNotifier<T>
): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, readable<T>(value, start));
}
export function getReadableContext<T>(key: string): Readable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Readable<T>>(unique_key);
}
export function setDerivedContext<S, T>(
	key: string,
	stores: S extends Stores ? any : any,
	callback: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
	initial_value?: T
): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, derived(stores, callback, initial_value));
}
export function getDerivedContext<T>(key: string): Readable<T> {
	return getReadableContext(key);
}
